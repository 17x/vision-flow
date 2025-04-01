import render from "../../core/renderer/renderer.ts"
import Editor from "../editor.ts"
import {generateScrollBars, initViewportDom, updateScrollBars} from "./domManipulations.ts"
import handleMouseDown from "./eventHandlers/mouseDown.ts"
import handleMouseMove from "./eventHandlers/mouseMove.ts"
import handleMouseUp from "./eventHandlers/mouseUp.ts"
import selectionRender from "./selectionRender.ts"
import handleKeyDown from "./eventHandlers/keyDown.ts"
import handleKeyUp from "./eventHandlers/keyUp.ts"
import handleWheel from "./eventHandlers/wheel.ts"
import handleContextMenu from "./eventHandlers/contextMenu.ts"
import handleTouchPoint from "./eventHandlers/Touch.ts"

// import {canvasToScreen} from "./TransformUtils.ts"

export interface Transform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

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
  readonly handleMouseDown
  readonly handleMouseUp
  readonly handleMouseMove
  readonly handleKeyDown
  readonly handleKeyUp
  readonly handleWheel
  readonly handleTouchPoint
  readonly handleContextMenu
  readonly eventsController: AbortController
  dpr = 2
  spaceKeyDown = false
  mouseDown = false
  panning = false
  selecting = false
  mouseDownPoint: Position = {x: 0, y: 0}
  mouseMovePoint: Position = {x: 0, y: 0}
  rect: Rect | undefined
  domResizing: boolean = false
  resizeTimeout: number | undefined
  currentZoom = 100
  offsetX: number = 0
  offsetY: number = 0
  transform: Transform

  constructor(editor: Editor) {
    const {scrollBarX, scrollBarY} = generateScrollBars()
    const selectionCanvas: HTMLCanvasElement = document.createElement("canvas")
    const mainCanvas: HTMLCanvasElement = document.createElement("canvas")
    const selectionCtx = selectionCanvas.getContext('2d')
    const mainCtx = mainCanvas.getContext('2d')

    this.transform = {scale: 1, offsetX: 0, offsetY: 0}
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
    this.doResize = this.doResize.bind(this)
    this.handleMouseDown = handleMouseDown.bind(this)
    this.handleMouseMove = handleMouseMove.bind(this)
    this.handleMouseUp = handleMouseUp.bind(this)
    this.handleKeyDown = handleKeyDown.bind(this)
    this.handleKeyUp = handleKeyUp.bind(this)
    this.handleWheel = handleWheel.bind(this)
    this.handleTouchPoint = handleTouchPoint.bind(this)
    this.handleContextMenu = handleContextMenu.bind(this)
    this.eventsController = new AbortController()
    this.init()
  }

  init() {
    this.doResize()
    initViewportDom.call(this)
    this.resizeObserver.observe(this.editor.container)
    this.setupEvents()
  }

  setupEvents() {
    const {signal} = this.eventsController

    window.addEventListener('mousedown', this.handleMouseDown, {signal})
    window.addEventListener('mousemove', this.handleMouseMove, {signal})
    window.addEventListener('mouseup', this.handleMouseUp, {signal})
    window.addEventListener('keydown', this.handleKeyDown, {signal})
    window.addEventListener('keyup', this.handleKeyUp, {signal})
    window.addEventListener('wheel', this.handleWheel, {signal, passive: false})
    // window.addEventListener('pointermove', this.handleTouchPoint, {signal, passive: false})
    this.wrapper.addEventListener('contextmenu', this.handleContextMenu, {signal})
  }

  translateViewport(x: number, y: number) {
    this.offsetX += x
    this.offsetY += y

    // this.offsetX = this.offsetX < 0 ? 0 : this.offsetX
    // this.offsetY = this.offsetY < 0 ? 0 : this.offsetY
    // console.log(this.offsetX, this.offsetY)
    this.renderMainCanvas()
  }

  updateScrollBar() {
    const {scrollBarX, scrollBarY} = this

    updateScrollBars(scrollBarX, scrollBarY)
  }

  resizeThrottle() {
    clearTimeout(this.resizeTimeout)

    this.domResizing = true
    this.resizeTimeout = setTimeout(() => {
      this.doResize()
      this.renderMainCanvas()
      this.renderSelectionCanvas()
      this.domResizing = false
    }, this.resizeInterval)
  }

  doResize() {
    this.rect = this.editor.container.getBoundingClientRect()
    this.mainCanvas.width = this.rect.width * this.dpr
    this.mainCanvas.height = this.rect.height * this.dpr
    this.selectionCanvas.width = this.rect.width * this.dpr
    this.selectionCanvas.height = this.rect.height * this.dpr
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

  renderMainCanvas() {
    const {mainCTX: ctx} = this

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    /*
      ctx transform parameters:
    - a (horizontal scaling): Scaling factor along the x-axis. Values greater than 1 scale the content,
      and values less than 1 shrink the content along the x-axis.
    - b (vertical skewing): Skewing factor for the x-axis. Non-zero values will skew the content along the x-axis.
    - c (horizontal skewing): Skewing factor for the y-axis. Non-zero values will skew the content along the y-axis.
    - d (vertical scaling): Scaling factor along the y-axis. Values greater than 1 scale the content,
      and values less than 1 shrink the content along the y-axis.
    - e (horizontal translation): Translation (movement) along the x-axis. Positive values move the content
      to the right, negative values move it to the left.
    - f (vertical translation): Translation (movement) along the y-axis. Positive values move the content
      down, negative values move it up.
    */
    const scale = 1
    ctx.save()
    // console.log(this.offsetX, this.offsetY, scale)

    ctx.transform(scale, 0, 0, scale, this.offsetX, this.offsetY)
    ctx.fillStyle = "blue"
    ctx.fillRect(0, 0, 100 * scale, 100 * scale)
    ctx.restore()

    const animate = () => {
      render({
        ctx: this.mainCTX,
        modules: this.editor.moduleMap,
      })
    }

    // requestAnimationFrame(animate)
  }

  renderSelectionCanvas() {
    this.selectionCTX.scale(this.dpr, this.dpr)

    const animate = () => {
      selectionRender.call(this.editor.selectionManager, this.selectionCTX)
    }

    requestAnimationFrame(animate)
  }

  /** Updates zoom state (calculations happen outside) */
  public updateZoom(newScale: number, newOffsetX: number, newOffsetY: number) {
    this.transform.scale = newScale
    this.transform.offsetX = newOffsetX
    this.transform.offsetY = newOffsetY
    // this.render()
  }

  /** Updates pan state (move to external logic) */
  public updatePan(newOffsetX: number, newOffsetY: number) {
    this.transform.offsetX = newOffsetX
    this.transform.offsetY = newOffsetY
    // this.render()
  }

  zoom(idx: number) {
    // console.log(idx)
    this.currentZoom += idx
    // console.log(this.currentZoom)
    /*if (this.currentZoom < 1) {
      this.currentZoom = 1
    }*/
    this.renderMainCanvas()
  }
}

export default Viewport