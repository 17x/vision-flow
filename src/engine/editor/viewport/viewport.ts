import render from "../../core/renderer/mainCanvasRenderer.ts"
import Editor from "../editor.ts"
import {generateScrollBars, initViewportDom, updateScrollBars} from "./domManipulations.ts"
import handleMouseDown from "./eventHandlers/mouseDown.ts"
import handlePointerMove from "./eventHandlers/pointerMove.ts"
import handleMouseUp from "./eventHandlers/mouseUp.ts"
import handleKeyDown from "./eventHandlers/keyDown.ts"
import handleKeyUp from "./eventHandlers/keyUp.ts"
import handleWheel from "./eventHandlers/wheel.ts"
import handleContextMenu from "./eventHandlers/contextMenu.ts"
import resetCanvas from "./resetCanvas.tsx"
import selectionRender from "./selectionRender.ts"

import {screenToCanvas} from "../../lib/lib.ts";

// import {drawCrossLine, isInsideRect} from "./helper.ts"
type ViewportManipulationType = 'static' | 'panning' | 'dragging' | 'resizing' | 'rotating' | 'zooming' | 'selecting'

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
  dpr = 2
  spaceKeyDown = false
  hoveredModules: UID[] = []
  // mouseDown = false
  manipulationStatus: ViewportManipulationType = 'static'

  mouseDownPoint: Position = {x: 0, y: 0}
  mouseMovePoint: Position = {x: 0, y: 0}
  offset: Position = {x: 0, y: 0}
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
    centerX: 0,
    centerY: 0,
  }
  domResizing: boolean = false
  resizeTimeout: number | undefined
  zoom = 1
  enableCrossLine = true
  drawCrossLine = false

  // transform: Transform

  constructor(editor: Editor) {
    const {scrollBarX, scrollBarY} = generateScrollBars()
    const selectionCanvas: HTMLCanvasElement = document.createElement("canvas")
    const mainCanvas: HTMLCanvasElement = document.createElement("canvas")
    const selectionCtx = selectionCanvas.getContext('2d')
    const mainCtx = mainCanvas.getContext('2d')

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

    window.addEventListener('mousedown', handleMouseDown.bind(this), {signal})
    window.addEventListener('mouseup', handleMouseUp.bind(this), {signal})
    window.addEventListener('keydown', handleKeyDown.bind(this), {signal})
    window.addEventListener('keyup', handleKeyUp.bind(this), {signal})
    window.addEventListener('wheel', handleWheel.bind(this), {signal, passive: false})
    this.wrapper.addEventListener('pointermove', handlePointerMove.bind(this), {signal})
    this.wrapper.addEventListener('contextmenu', handleContextMenu.bind(this), {signal})
  }

  updateVirtualRect() {
    const {x: minX, y: minY} = this.screenToCanvas(0, 0)
    const {
      x: maxX,
      y: maxY
    } = this.screenToCanvas(this.rect!.width, this.rect!.height)
    const width = maxX - minX
    const height = maxY - minY

    this.virtualRect = {
      x: minX,
      y: minY,
      width,
      height,
      centerX: minX + width / 2,
      centerY: minY + height / 2,
      top: minY,
      right: maxX,
      bottom: maxY,
      left: minX,
    }

    this.editor.updateVisibleModuleMap(this.virtualRect)
  }

  scale(idx: number) {
    // console.log(idx)
    const minZoom = .1
    const maxZoom = 10
    this.zoom += idx
    // console.log(this.currentZoom)
    if (this.zoom < minZoom) {
      this.zoom = minZoom
    }
    if (this.zoom > maxZoom) {
      this.zoom = maxZoom
    }

    this.updateVirtualRect()
    this.render()
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
    this.resizeTimeout = setTimeout(this.onResize.bind(this), this.resizeInterval)
  }

  onResize() {
    this.domResizing = false
    this.updateCanvasSize()
    // updateAllVisible
    this.updateVirtualRect()
    this.render()

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
    const {dpr, offset, zoom} = this
    return screenToCanvas(zoom, offset.x * dpr, offset.y * dpr, x * dpr, y * dpr)
  }

  // Update all usually means the viewport has been moved or zoomed

  resetMainCanvas() {
    resetCanvas(this.mainCTX, this.dpr, this.zoom, this.offset)
  }

  resetSelectionCanvas() {
    resetCanvas(this.selectionCTX, this.dpr, this.zoom, this.offset)
  }

  renderMainCanvas() {
    const animate = () => {
      render({
        ctx: this.mainCTX,
        modules: this.editor.visibleModuleMap
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

    this.wrapper.style.width = '100%'
    this.wrapper.style.height = '100%'
    this.wrapper.remove()
    this.editor.container.innerHTML = ''
  }
}

export default Viewport