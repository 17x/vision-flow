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
  readonly handleContextMenu
  readonly eventsController: AbortController
  dpr = 2
  spaceKeyDown = false
  mouseDown = false
  panning = false
  selecting = false
  mouseDownPoint: Position = {x: 0, y: 0}
  mouseCurrentPoint: Position = {x: 0, y: 0}
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
    this.wrapper.addEventListener('contextmenu', this.handleContextMenu, {signal})

    document.addEventListener("touchstart", (event) => {
      console.log('pre')
      event.preventDefault() // Stops touch interactions
    }, {passive: false})

    document.addEventListener("touchmove", (event) => {
      console.log('pre')
      event.preventDefault() // Stops scrolling with touchpad
    }, {passive: false})

    document.addEventListener("touchend", (event) => {
      console.log('pre')
      event.preventDefault()
    }, {passive: false})

    document.addEventListener("gesturestart", (event) => {
      console.log('gesturestart')
      event.preventDefault()
    })
    document.addEventListener("gesturechange", (event) => {
      console.log('gesturechange')
      event.preventDefault()
    })
    document.addEventListener("gestureend", (event) => {
      console.log('gestureend')
      event.preventDefault()
    })
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
    const {mainCTX: ctx, transform: {scale}} = this

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    console.log(this.transform)
    // Example: Draw a virtual module at (100, 100) in canvas space
    // const screenPos = canvasToScreen(this.transform, 100, 100)
    // In the Canvas API, transformations are applied in right-to-left order,
    // meaning that the transformations are applied
    // starting from the last one and moving toward the first one.
    // ctx.transform()
    console.log(scale)
    ctx.fillStyle = "blue"
    ctx.fillRect(0, 0, 50 * scale, 50 * scale)

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
    console.log(idx)
    this.currentZoom += idx
    // console.log(this.currentZoom)
    /*if (this.currentZoom < 1) {
      this.currentZoom = 1
    }*/
    this.renderMainCanvas()
  }
}

export default Viewport