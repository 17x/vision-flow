import Editor from "../editor.ts"
import {generateScrollBars, initViewportDom, updateScrollBars} from "./domManipulations.ts"
import handleMouseDown from "./events/mouseDown.ts"
import handleMouseMove from "./events/mouseMove.ts"
import handleMouseUp from "./events/mouseUp.ts"

class Viewport {
  readonly editor: Editor
  readonly resizeInterval: number = 100
  readonly resizeObserver: ResizeObserver
  readonly wrapper: HTMLDivElement
  readonly scrollBarX: HTMLDivElement
  readonly scrollBarY: HTMLDivElement
  readonly selectionBox: HTMLDivElement
  readonly handleMouseDown
  readonly handleMouseUp
  readonly handleMouseMove
  mouseDown = false
  pointMouseDown: Position = {x: 0, y: 0}
  pointMouseCurrent: Position = {x: 0, y: 0}
  rect: Rect | undefined
  domResizing: boolean = false
  resizeTimeout: number | undefined

  constructor(editor: Editor) {
    const {scrollBarX, scrollBarY} = generateScrollBars()

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
    this.init()
  }

  init() {
    initViewportDom.call(this)
    this.resizeObserver.observe(this.editor.container)
    this.doResize()
    this.setupEvents()
  }

  setupEvents() {
    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  unSetupEvents() {
    window.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
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
      this.domResizing = false
    }, this.resizeInterval)
  }

  doResize() {
    this.rect = this.editor.container.getBoundingClientRect()
  }

  destroy() {
    clearTimeout(this.resizeTimeout)
    this.resizeObserver.disconnect()
    this.unSetupEvents()
    this.wrapper.style.width = '100%'
    this.wrapper.style.height = '100%'
    this.wrapper.remove()
    this.editor.container.innerHTML = ''
  }
}

export default Viewport