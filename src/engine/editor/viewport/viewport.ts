import render from "../../core/renderer/mainCanvasRenderer.ts"
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
import resetCanvas from "./resetCanvas.tsx"
import {drawCrossLine} from "./helper.ts"

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
  zooming = false
  selecting = false
  mouseDownPoint: Position = {x: 0, y: 0}
  mouseMovePoint: Position = {x: 0, y: 0}
  offset: Position = {x: 0, y: 0}
  rect: Rect | undefined
  domResizing: boolean = false
  resizeTimeout: number | undefined
  currentZoom = 1
  enableCrossLine = true

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
    this.updateCanvasSize()
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

  zoom(idx: number) {
    // console.log(idx)
    const minZoom = .1
    const maxZoom = 10
    this.currentZoom += idx
    // console.log(this.currentZoom)
    if (this.currentZoom < minZoom) {
      this.currentZoom = minZoom
    }
    if (this.currentZoom > maxZoom) {
      this.currentZoom = maxZoom
    }

    this.render()
  }

  translateViewport(x: number, y: number) {
    this.offset.x += x
    this.offset.y += y
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

    // todo test
    // set zoom and shift on init
    // this.offsetX = 200
    // this.offsetY = 200
    // console.log(this)
    this.domResizing = false
    this.updateCanvasSize()
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

  // Update all usually means the viewport has been moved or zoomed
  render() {
    this.resetMainCanvas()
    this.resetSelectionCanvas()
    this.renderMainCanvas()
    this.renderSelectionCanvas()
  }

  resetMainCanvas() {
    resetCanvas(this.mainCTX, this.dpr, [this.currentZoom, 0, 0, this.currentZoom, this.offset.x, this.offset.y])
  }

  resetSelectionCanvas() {
    resetCanvas(this.selectionCTX, this.dpr, [this.currentZoom, 0, 0, this.currentZoom, this.offset.x, this.offset.y])
  }

  renderMainCanvas() {
    const animate = () => {
      render({
        ctx: this.mainCTX,
        modules: this.editor.moduleMap
      })
    }

    requestAnimationFrame(animate)
  }

  renderSelectionCanvas() {
    const animate = () => {
      if (this.enableCrossLine) {
        // cross line
        // const {dpr} = this
        drawCrossLine({
          ctx:this.selectionCTX,
          mousePoint: this.mouseMovePoint,
          scale: this.currentZoom,
          dpr: this.dpr,
          offset: this.offset
        })
        // this.selectionCTX.textBaseline = 'alphabetic'
        // this.selectionCTX.font = `${24 / this.currentZoom}px sans-serif`
        // this.selectionCTX.fillText(Math.floor(x) + ', ' + Math.floor(y), x, y, 100 / this.currentZoom)
        // console.log(x, y)
      }
      selectionRender.call(this)

    }

    requestAnimationFrame(animate)
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