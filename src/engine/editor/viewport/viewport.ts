import render from "../../core/renderer/mainCanvasRenderer.ts"
import Editor from "../editor.ts"
import {generateScrollBars, initViewportDom, updateScrollBars,} from "./domManipulations.ts"
import handleMouseDown from "./eventHandlers/mouseDown.ts"
import handlePointerMove from "./eventHandlers/pointerMove.ts"
import handleMouseUp from "./eventHandlers/mouseUp.ts"
import handleKeyDown from "./eventHandlers/keyDown.ts"
import handleKeyUp from "./eventHandlers/keyUp.ts"
import handleWheel from "./eventHandlers/wheel.ts"
import handleContextMenu from "./eventHandlers/contextMenu.ts"
import resetCanvas from "./resetCanvas.tsx"
import selectionRender from "./selectionRender.ts"
import {screenToCanvas} from "../../lib/lib.ts"
import {RectangleRenderProps} from "../../core/renderer/type"
import {createBoundingRect, createFrame, fitRectToViewport} from "./helper.ts"
import {generateBoundingRectFromRotatedRect} from "../../core/utils.ts"

// import {drawCrossLine, isInsideRect} from "./helper.ts"
type ViewportManipulationType =
  | "static"
  | "panning"
  | "dragging"
  | "resizing"
  | "rotating"
  | "zooming"
  | "selecting";

class Viewport {
  readonly editor: Editor
  readonly resizeInterval: number = 17
  readonly resizeObserver: ResizeObserver
  readonly wrapper: HTMLDivElement
  readonly scrollBarX: HTMLDivElement
  readonly scrollBarY: HTMLDivElement
  readonly selectionBox: HTMLDivElement
  readonly selectionCanvas: HTMLCanvasElement
  readonly selectionCTX: CanvasRenderingContext2D
  readonly mainCanvas: HTMLCanvasElement
  readonly mainCTX: CanvasRenderingContext2D
  readonly eventsController: AbortController
  private initialized = false
  dpr = 2
  spaceKeyDown = false
  hoveredModules: Set<UID> = new Set()
  handlingModules: Set<UID> = new Set()
  zooming = false
  manipulationStatus: ViewportManipulationType = "static"
  frame: Partial<RectangleRenderProps> & BoundingRect = createFrame('A4')
  mouseDownPoint: Point = {x: 0, y: 0}
  mouseMovePoint: Point = {x: 0, y: 0}
  offset: Point = {x: 0, y: 0}
  rect: Rect | undefined
  virtualRect: BoundingRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    cx: 0,
    cy: 0,
  }
  domResizing: boolean = false
  resizeTimeout: number | undefined
  scale = 1
  enableCrossLine = true
  drawCrossLine = false

  // transform: Transform

  constructor(editor: Editor) {
    const {scrollBarX, scrollBarY} = generateScrollBars()
    const selectionCanvas: HTMLCanvasElement = document.createElement("canvas")
    const mainCanvas: HTMLCanvasElement = document.createElement("canvas")
    const selectionCtx = selectionCanvas.getContext("2d")
    const mainCtx = mainCanvas.getContext("2d")

    // this.transform = {scale: 1, offsetX: 0, offsetY: 0}
    this.selectionCanvas = selectionCanvas
    this.mainCanvas = mainCanvas
    this.selectionCTX = selectionCtx as CanvasRenderingContext2D
    this.mainCTX = mainCtx as CanvasRenderingContext2D
    this.editor = editor
    this.scrollBarX = scrollBarX
    this.scrollBarY = scrollBarY
    this.selectionBox = document.createElement("div")
    this.wrapper = document.createElement("div")
    this.resizeThrottle = this.resizeThrottle.bind(this)
    this.resizeObserver = new ResizeObserver(this.resizeThrottle)
    this.updateCanvasSize = this.updateCanvasSize.bind(this)
    this.eventsController = new AbortController()

    this.init()
  }

  init() {
    this.updateCanvasSize()
    initViewportDom.call(this)
    this.resizeObserver.observe(this.editor.container)
    this.setupEvents()
  }

  setupEvents() {
    const {signal} = this.eventsController

    window.addEventListener("mousedown", handleMouseDown.bind(this), {
      signal,
    })
    window.addEventListener("mouseup", handleMouseUp.bind(this), {signal})
    window.addEventListener("keydown", handleKeyDown.bind(this), {signal})
    window.addEventListener("keyup", handleKeyUp.bind(this), {signal})
    window.addEventListener("wheel", handleWheel.bind(this), {
      signal,
      passive: false,
    })
    this.wrapper.addEventListener("pointermove", handlePointerMove.bind(this), {
      signal,
    })
    this.wrapper.addEventListener("contextmenu", handleContextMenu.bind(this), {
      signal,
    })
  }

  updateVirtualRect() {
    const {x: minX, y: minY} = this.screenToCanvas(0, 0)
    const {x: maxX, y: maxY} = this.screenToCanvas(
      this.rect!.width,
      this.rect!.height
    )
    const {x: mouseVirtualX, y: mouseVirtualY} = this.screenToCanvas(this.mouseMovePoint.x, this.mouseMovePoint.y)
    const width = maxX - minX
    const height = maxY - minY

    this.virtualRect = {
      x: minX,
      y: minY,
      width,
      height,
      cx: minX + width / 2,
      cy: minY + height / 2,
      top: minY,
      right: maxX,
      bottom: maxY,
      left: minX,
    }

    this.editor.updateVisibleModuleMap(this.virtualRect)
    this.editor.events.onViewportUpdated?.({
      offsetX: this.offset.x,
      offsetY: this.offset.y,
      scale: this.scale,
      dx: mouseVirtualX,
      dy: mouseVirtualY,
      status: this.manipulationStatus,
      width,
      height
    })
  }

  /*
    zoom(idx: number, point?: Point) {
      // console.log(idx)
      const minZoom = 0.1;
      const maxZoom = 10;
      this.scale += idx;
      // console.log(point)
      // console.log(this.currentZoom)
      if (this.scale < minZoom) {
        this.scale = minZoom;
      }
      if (this.scale > maxZoom) {
        this.scale = maxZoom;
      }

      this.updateVirtualRect();
      this.render();
    }
  */

  zoomAtPoint(point: Point, zoom: number, zoomTo: boolean = false) {
    const {offset, scale} = this
    let newScale = scale + zoom

    if (zoomTo) {
      newScale = zoom
    }

    // Clamp scale
    const minScale = 0.1
    const maxScale = 10
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale))

    // Calculate zoom factor
    const zoomFactor = clampedScale / scale

    // Convert screen point to canvas coordinates before zoom
    const canvasPoint = this.screenToCanvas(point.x, point.y)

    // Calculate new offset to keep the point under cursor stable
    const newOffsetX = canvasPoint.x - (canvasPoint.x - offset.x) * zoomFactor
    const newOffsetY = canvasPoint.y - (canvasPoint.y - offset.y) * zoomFactor

    // Apply updated values
    this.scale = clampedScale
    this.setTranslateViewport(newOffsetX, newOffsetY)
    this.updateVirtualRect()
    this.render()
  }

  zoomTo(newScale: number | 'fit') {
    console.log(newScale)
    if (newScale === 'fit') {
      this.fitFrame()
    } else {
      this.zoomAtPoint({
        x: this.rect!.width / 2,
        y: this.rect!.height / 2,
      }, newScale, true)
    }
  }

  setTranslateViewport(x: number, y: number) {
    this.offset.x = 0
    this.offset.y = 0
    this.translateViewport(x, y)
  }

  translateViewport(x: number, y: number) {
    this.offset.x += x
    this.offset.y += y
    this.updateVirtualRect()
    this.render()
  }

  updateScrollBar() {
    const {scrollBarX, scrollBarY} = this

    updateScrollBars(scrollBarX, scrollBarY)
  }

  resizeThrottle() {
    clearTimeout(this.resizeTimeout)

    this.domResizing = true
    this.resizeTimeout = setTimeout(
      this.onResize.bind(this),
      this.resizeInterval
    )
  }

  onResize() {
    this.domResizing = false
    this.updateCanvasSize()
    this.updateVirtualRect()
    this.render()

    if (!this.initialized) {
      this.initialized = true
      this.fitFrame()
    }
    // this.mainCTX.fillStyle = '#000000'
    // this.mainCTX.fillRect(0, 0, 300, 300)
  }

  updateCanvasSize() {
    this.rect = this.editor.container.getBoundingClientRect()
    this.mainCanvas.width = this.rect.width * this.dpr
    this.mainCanvas.height = this.rect.height * this.dpr
    this.selectionCanvas.width = this.rect.width * this.dpr
    this.selectionCanvas.height = this.rect.height * this.dpr
  }

  screenToCanvas(x: number, y: number) {
    const {dpr, offset, scale} = this
    return screenToCanvas(
      scale,
      offset.x * dpr,
      offset.y * dpr,
      x * dpr,
      y * dpr
    )
  }

  fitFrame() {
    const {dpr, frame, rect, virtualRect} = this
    const testFrame = generateBoundingRectFromRotatedRect({
      x: 800,
      y: 800,
      width: 100,
      height: 100
    }, 50)
    // console.log(testFrame)
    // console.log(frame)
    const viewportRect = createBoundingRect(0, 0, rect!.width * dpr, rect!.height * dpr)
    const {scale, offsetX, offsetY} = fitRectToViewport(frame, viewportRect, dpr)

    // console.log(virtualRect)
    console.log(scale, offsetX, offsetY)

    this.scale = scale
    this.offset.x = offsetX
    this.offset.y = offsetY
    this.render()
    this.updateVirtualRect()
    console.log(this.virtualRect)
    console.log(this.scale, this.offset)
  }

  fitRect() {

  }

  resetMainCanvas() {
    resetCanvas(this.mainCTX, this.dpr, this.scale, this.offset)
  }

  resetSelectionCanvas() {
    resetCanvas(this.selectionCTX, this.dpr, this.scale, this.offset)
  }

  renderMainCanvas() {
    const animate = () => {
      render({
        ctx: this.mainCTX,
        frame: this.frame,
        modules: this.editor.visibleModuleMap,
      })
    }

    requestAnimationFrame(animate)
  }

  renderSelectionCanvas() {
    const animate = () => {
      selectionRender.call(this)
    }

    requestAnimationFrame(animate)
  }

  render() {
    this.resetMainCanvas()
    this.resetSelectionCanvas()
    this.renderMainCanvas()
    this.renderSelectionCanvas()
  }

  destroy() {
    clearTimeout(this.resizeTimeout)
    this.resizeObserver.disconnect()
    // this.unSetupEvents()
    this.eventsController.abort()

    this.wrapper.style.width = "100%"
    this.wrapper.style.height = "100%"
    this.wrapper.remove()
    this.editor.container.innerHTML = ""
  }
}

export default Viewport
