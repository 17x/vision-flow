/*import render from '../../core/renderer/mainCanvasRenderer.ts'
import Editor from '../editor.ts'
import {
  generateScrollBars,
  initViewportDom,
  updateScrollBars,
} from './domManipulations.ts'
import handleMouseDown from './eventHandlers/mouseDown.ts'
import handlePointerMove from './eventHandlers/pointerMove.ts'
import handleMouseUp from './eventHandlers/mouseUp.ts'
import handleKeyDown from './eventHandlers/keyDown.ts'
import handleKeyUp from './eventHandlers/keyUp.ts'
import handleWheel from './eventHandlers/wheel.ts'
import handleContextMenu from './eventHandlers/contextMenu.ts'
import resetCanvas from './resetCanvas.tsx'
import selectionRender from './selectionRender.ts'
import {screenToCanvas} from '../../lib/lib.ts'
import {
  createFrame,
  fitRectToViewport,
} from './helper.ts'
import {generateBoundingRectFromTwoPoints} from '../../core/utils.ts'
import {initSelection} from '../selection/helper.ts'*/
import {RectangleRenderProps} from '../../core/renderer/type'
/*
type ViewportManipulationType =
  | 'static'
  | 'panning'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'zooming'
  | 'selecting';*/
/*
class Viewport1 {
 /!* readonly editor: Editor
  readonly resizeInterval: number = 1
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
  private initialized = false*!/
  dpr = 2
  spaceKeyDown = false
  hoveredModules: Set<UID> = new Set()
  handlingModules: Set<UID> = new Set()
  zooming = false
  manipulationStatus: ViewportManipulationType = 'static'
  frame: Partial<RectangleRenderProps> & BoundingRect = createFrame('A4')
  mouseDownPoint: Point = {x: 0, y: 0}
  mouseMovePoint: Point = {x: 0, y: 0}
  offset: Point = {x: 0, y: 0}
  rect: BoundingRect = generateBoundingRectFromTwoPoints({x: 0, y: 0}, {x: 0, y: 0})
  viewportRect: BoundingRect = generateBoundingRectFromTwoPoints({x: 0, y: 0}, {x: 0, y: 0})
  worldRect: BoundingRect = generateBoundingRectFromTwoPoints({x: 0, y: 0}, {x: 0, y: 0})
  domResizing: boolean = false
  resizeTimeout: number | undefined
  scale = 1
  enableCrossLine = true
  drawCrossLineDefault = false
  drawCrossLine = false

  // transform: Transform

  constructor(editor: Editor) {
    const {scrollBarX, scrollBarY} = generateScrollBars()
    const selectionCanvas: HTMLCanvasElement = document.createElement('canvas')
    const mainCanvas: HTMLCanvasElement = document.createElement('canvas')
    const selectionCtx = selectionCanvas.getContext('2d')
    const mainCtx = mainCanvas.getContext('2d')

    this.viewport.selectionCanvas = selectionCanvas
    this.viewport.mainCanvas = mainCanvas
    this.viewport.selectionCTX = selectionCtx as CanvasRenderingContext2D
    this.viewport.mainCTX = mainCtx as CanvasRenderingContext2D
    this.viewport = editor
    this.viewport.scrollBarX = scrollBarX
    this.viewport.scrollBarY = scrollBarY
    this.viewport.selectionBox = document.createElement('div')
    this.viewport.wrapper = document.createElement('div')
    this.viewport.resizeThrottle = this.viewport.resizeThrottle.bind(this)
    this.viewport.resizeObserver = new ResizeObserver(this.viewport.resizeThrottle)
    // this.viewport.updateViewport = this.viewport.updateViewport.bind(this)
    this.viewport.eventsController = new AbortController()

    this.viewport.initViewport()
  }
/!*

  initViewport() {
    initViewportDom.call(this)
    this.viewport.resizeObserver.observe(this.viewport.container)
    this.viewport.setupEvents()

    this.viewport.action.on('viewport-resize', () => {
      this.viewport.domResizing = false
      this.viewport.updateViewport()

      if (!this.viewport.initialized) {
        const {frame, viewportRect} = this
        const {scale, offsetX, offsetY} = fitRectToViewport(frame, viewportRect)

        this.viewport.scale = scale
        this.viewport.offset.x = offsetX
        this.viewport.offset.y = offsetY
        this.viewport.initialized = true
      }

      this.viewport.updateWorldRect()
      this.viewport.action.dispatch({type: 'world-update', data: {...this.viewport.worldRect}})
      // this.viewport.render()
    })

    this.viewport.action.on('world-shift', () => {
      this.viewport.updateWorldRect()
      this.viewport.action.dispatch({type: 'world-update', data: {...this.viewport.worldRect}})
    })

    this.viewport.action.on('viewport-panning', (data) => {
      this.viewport.offset.x += (data as Point).x
      this.viewport.offset.y += (data as Point).y
      this.viewport.updateWorldRect()
      this.viewport.action.dispatch({type: 'world-update', data: {...this.viewport.worldRect}})
    })
    // this.viewport.action.subscribe('world-update', () => { })
    // this.viewport.action.subscribe('world-zoom', () => {    })

    this.viewport.action.on('visible-module-update', () => {
      resetCanvas(this.viewport.mainCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
      this.viewport.renderModules()
    })

    this.viewport.action.on('visible-selected-update', (data) => {
      resetCanvas(this.viewport.selectionCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
      this.viewport.renderSelections(data.idSet as Set<UID>)
    })
  }

  initSelection() {
    initSelection.call(this)
  }

  renderModules() {
    const animate = () => {
      render({
        ctx: this.viewport.mainCTX,
        frame: this.viewport.frame,
        modules: this.viewport.getVisibleModuleMap(),
      })
    }

    requestAnimationFrame(animate)
  }

  renderSelections(modules: Set<UID>) {
    // console.log(modules)
    const animate = () => {
      selectionRender.call(this, modules)
    }

    requestAnimationFrame(animate)
  }

  resizeThrottle() {
    clearTimeout(this.viewport.resizeTimeout)

    this.viewport.domResizing = true
    this.viewport.resizeTimeout = setTimeout(() => {
        this.viewport.action.dispatch({type: 'viewport-resize'})
      },
      this.viewport.resizeInterval,
    )
  }

  setupEvents() {
    const {signal} = this.viewport.eventsController

    window.addEventListener('mousedown', handleMouseDown.bind(this), {
      signal,
    })
    window.addEventListener('mouseup', handleMouseUp.bind(this), {signal})
    window.addEventListener('keydown', handleKeyDown.bind(this), {signal})
    window.addEventListener('keyup', handleKeyUp.bind(this), {signal})
    window.addEventListener('wheel', handleWheel.bind(this), {
      signal,
      passive: false,
    })
    this.viewport.wrapper.addEventListener('pointermove', handlePointerMove.bind(this), {
      signal,
    })
    this.viewport.wrapper.addEventListener('contextmenu', handleContextMenu.bind(this), {
      signal,
    })
  }

  updateWorldRect() {
    const {width, height} = this.viewport.viewportRect
    const p1 = this.viewport.getWorldPointByViewportPoint(0, 0)
    const p2 = this.viewport.getWorldPointByViewportPoint(width, height)

    this.viewport.worldRect = generateBoundingRectFromTwoPoints(p1, p2)
  }

  getWorldRect() {
    return {...this.viewport.worldRect}
  }

  /!*
    zoom(idx: number, point?: Point) {
      // console.log(idx)
      const minZoom = 0.1;
      const maxZoom = 10;
      this.viewport.scale += idx;
      // console.log(point)
      // console.log(this.viewport.currentZoom)
      if (this.viewport.scale < minZoom) {
        this.viewport.scale = minZoom;
      }
      if (this.viewport.scale > maxZoom) {
        this.viewport.scale = maxZoom;
      }

      this.viewport.updateVirtualRect();
      this.viewport.render();
    }
  *!/

  zoomAtPoint(point: Point, zoom: number, zoomTo: boolean = false) {
    const {offset, scale, dpr} = this
    const minScale = 0.1
    const maxScale = 5
    let newScale = scale + zoom
    // const offsetX = 0
    // const offsetY = 0
    const pointX = point.x * scale
    const pointY = point.y * scale
    const rect = {
      x: 0,
      y: 0,
      width: this.viewport.rect!.width * dpr,
      height: this.viewport.rect!.height * dpr,
    }
    /!*    console.log(
      pointX,
      pointY,
      rect,
    )*!/
    if (zoomTo) {
      newScale = zoom
    }

    if (newScale < minScale || newScale > maxScale) return

    // Clamp scale
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale))

    // Calculate zoom factor
    const zoomFactor = clampedScale / scale

    // Convert screen point to canvas coordinates before zoom
    const canvasPoint = this.viewport.getWorldPointByViewportPoint(point.x, point.y)

    // Calculate the offset adjustment so that the zoom is centered around the point
    const newOffsetX = canvasPoint.x - (canvasPoint.x - offset.x) * zoomFactor
    const newOffsetY = canvasPoint.y - (canvasPoint.y - offset.y) * zoomFactor

    // const newOffsetX = offset.x - (canvasPoint.x * (zoomFactor - 1))
    // const newOffsetY = offset.y - (canvasPoint.y * (zoomFactor - 1))

    // Apply updated values
    this.viewport.scale = clampedScale
    this.viewport.offset.x = newOffsetX
    this.viewport.offset.y = newOffsetY
    // this.viewport.render()
    this.viewport.updateWorldRect()
  }

  zoomTo(newScale: number | 'fit') {
    console.log(newScale)
    if (newScale === 'fit') {
      this.viewport.fitFrame()
    } else {
      this.viewport.zoomAtPoint(
        {
          x: this.viewport.rect!.width / 2,
          y: this.viewport.viewportRect.height / 2,
        },
        newScale,
        true,
      )
    }
  }

  setTranslateViewport(x: number, y: number) {
    this.viewport.offset.x = 0
    this.viewport.offset.y = 0
    this.viewport.translateViewport(x, y)
  }

  translateViewport(x: number, y: number) {
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    // this.viewport.updateWorldRect()
    // this.viewport.render()
  }

  updateScrollBar() {
    const {scrollBarX, scrollBarY} = this

    updateScrollBars(scrollBarX, scrollBarY)
  }

  updateViewport() {
    const {dpr, mainCanvas, selectionCanvas} = this
    const rect = this.viewport.container.getBoundingClientRect().toJSON()
    const {x, y, width, height} = rect
    const viewportWidth = width * dpr
    const viewportHeight = height * dpr

    this.viewport.rect = {...rect, cx: x + width / 2, cy: y + height / 2}
    this.viewport.viewportRect = generateBoundingRectFromTwoPoints(
      {x: 0, y: 0},
      {x: viewportWidth, y: viewportHeight},
    )

    mainCanvas.width = selectionCanvas.width = viewportWidth
    mainCanvas.height = selectionCanvas.height = viewportHeight
  }

  getWorldPointByViewportPoint(x: number, y: number) {
    const {dpr, offset, scale} = this

    return screenToCanvas(
      scale,
      offset.x * dpr,
      offset.y * dpr,
      x * dpr,
      y * dpr,
    )
  }

  fitFrame() {
    console.log('fit')
    // const {frame, viewportRect} = this
    /!* const testFrame = generateBoundingRectFromRotatedRect({
       x: 800,
       y: 800,
       width: 100,
       height: 100
     }, 50)*!/
    // console.log(testFrame)
    // console.log(frame)

    // const {scale, offsetX, offsetY} = fitRectToViewport(frame, viewportRect)

    // console.log(virtualRect)
    // console.log(scale, offsetX, offsetY)
    /!*
        this.viewport.scale = scale
        this.viewport.offset.x = offsetX
        this.viewport.offset.y = offsetY*!/
    // this.viewport.render()
    // this.viewport.updateWorldRect()
  }

  resetSelectionCanvas() {
    resetCanvas(this.viewport.selectionCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
  }

  renderMainCanvas() {
    const animate = () => {
      render({
        ctx: this.viewport.mainCTX,
        frame: this.viewport.frame,
        modules: this.viewport.getVisibleModuleMap(),
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
*!/

  /!*  render() {
      this.viewport.resetMainCanvas()
      this.viewport.resetSelectionCanvas()
      this.viewport.renderMainCanvas()
      this.viewport.renderSelectionCanvas()
    }*!/

  destroy() {
    clearTimeout(this.viewport.resizeTimeout)
    this.viewport.resizeObserver.disconnect()
    // this.viewport.unSetupEvents()
    this.viewport.eventsController.abort()

    this.viewport.wrapper.style.width = '100%'
    this.viewport.wrapper.style.height = '100%'
    this.viewport.wrapper.remove()
    this.viewport.container.innerHTML = ''
  }
}

export default Viewport1*/

/*
export interface Viewport {
  // editor: Editor
  resizeInterval: number
  resizeObserver: ResizeObserver
  wrapper: HTMLDivElement
  scrollBarX: HTMLDivElement
  scrollBarY: HTMLDivElement
  selectionBox: HTMLDivElement
  selectionCanvas: HTMLCanvasElement
  selectionCTX: CanvasRenderingContext2D
  mainCanvas: HTMLCanvasElement
  mainCTX: CanvasRenderingContext2D
  eventsController: AbortController
  initialized: boolean
  dpr: number
  spaceKeyDown: boolean
  hoveredModules: Set<UID>
  handlingModules: Set<UID>
  zooming: number
  manipulationStatus: ViewportManipulationType
  frame: Partial<RectangleRenderProps> & BoundingRect
  mouseDownPoint: Point
  mouseMovePoint: Point
  offset: Point
  rect: BoundingRect
  viewportRect: BoundingRect
  worldRect: BoundingRect
  domResizing: boolean
  resizeTimeout: number | undefined
  scale: number
  enableCrossLine: boolean
  drawCrossLineDefault: boolean
  drawCrossLine: boolean

}
*/
