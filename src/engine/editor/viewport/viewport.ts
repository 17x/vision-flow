import render from "../../core/renderer/renderer.ts"
import Editor from "../editor.ts"
import {generateScrollBars, initViewportDom, updateScrollBars} from "./domManipulations.ts"
import handleMouseDown from "./events/mouseDown.ts"
import handleMouseMove from "./events/mouseMove.ts"
import handleMouseUp from "./events/mouseUp.ts"
import selectionRender from "./selectionRender.ts"
import handleKeyDown from "./events/keyDown.ts"
import handleKeyUp from "./events/keyUp.ts"
import handleWheel from "./events/wheel.ts"
import handleContextMenu from "./events/contextMenu.ts"

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
  // altKey is optionKey in MACOS
  altKey = false
  mouseDown = false
  pointMouseDown: Position = {x: 0, y: 0}
  pointMouseCurrent: Position = {x: 0, y: 0}
  rect: Rect | undefined
  domResizing: boolean = false
  resizeTimeout: number | undefined
  currentZoom = 100
  view = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }

  constructor(editor: Editor) {
    const {scrollBarX, scrollBarY} = generateScrollBars()
    const selectionCanvas: HTMLCanvasElement = document.createElement("canvas")
    const mainCanvas: HTMLCanvasElement = document.createElement("canvas")
    const selectionCtx = selectionCanvas.getContext('2d')
    const mainCtx = mainCanvas.getContext('2d')

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
    window.addEventListener('wheel', this.handleWheel, {signal})
    this.wrapper.addEventListener('contextmenu', this.handleContextMenu, {signal})
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
    console.log(this.currentZoom / 100)
    // this.mainCTX.scale(this.dpr, this.dpr)
    this.mainCTX.imageSmoothingEnabled = true
    this.mainCTX.imageSmoothingQuality = "high"

    this.mainCTX.setTransform(this.currentZoom/100, 0, 0, this.currentZoom/100, this.pointMouseCurrent.x, this.pointMouseCurrent.y)
    this.mainCTX.clearRect(
      0,
      0,
      this.mainCTX.canvas.width,
      this.mainCTX.canvas.height
    )
    const animate = () => {
      render({
        ctx: this.mainCTX,
        modules: this.editor.moduleMap,
      })
    }

    requestAnimationFrame(animate)
  }

  renderSelectionCanvas() {
    this.selectionCTX.scale(this.dpr, this.dpr)

    const animate = () => {
      selectionRender.call(this.editor.selectionManager, this.selectionCTX)
    }

    requestAnimationFrame(animate)
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