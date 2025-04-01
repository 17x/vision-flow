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
    window.addEventListener('wheel', check, {passive: false});

    /*
    * TOUCHPAD panning:
    * x: UInt
    * */

    function check(event: WheelEvent) {
      /**
       * 1. touchpad
       *  panning
       *    x: UInt
       *    y: UInt
       *  zoom
       *    x === -0
       *    y: Float
       * 2. mouse scroll
       *    2.1 vertical scroll
       *      x === -0
       *      y: Float, abs(value) > 4, and increasing
       *    2.2 horizontal scroll
       *      x: UInt, increasing and
       *      y === -0
       */
      const {deltaX, deltaY} = event
      // console.log('wheel', deltaX, deltaY)
      // console.log(isUInt(deltaX), isUInt(deltaY))
      if (isUInt(deltaX) && isUInt(deltaY)) {
        console.log('panning')
      }

      event.preventDefault()
    }

    function isUInt(v: number) {return !isFloat(v)}

    function isFloat(v: number) {return Math.abs(v) % 1 !== 0}

    function handleWheelEvent(event) {
      // Normalize the event to support cross-browser compatibility
      // event = event || window.event;
      console.log(event.deltaX, event.deltaY)
      // Prevent default scrolling behavior (like page scroll)
      event.preventDefault();
      return

      // Check if the event is coming from the mouse (Alt key is pressed) or the touchpad (no Alt key)
      if (event.altKey) {
        // Mouse (with Alt key): Zooming functionality
        handleZoom(event);
      } else {
        // Touchpad (without Alt key): Zooming or panning based on the scroll direction
        handlePanningOrZooming(event);
      }
    }

// Handle zooming with the mouse (when Alt key is pressed)
    function handleZoom(event) {
      // Zoom in or out based on the wheel scroll direction (deltaY or deltaX)
      let zoomFactor = event.deltaY < 0 || event.deltaX < 0 ? 1.1 : 0.9; // Zoom in or out

      // Apply zoom (scale the body or container element as an example)
      let scale = document.body.style.transform || "scale(1)";
      scale = parseFloat(scale.match(/[\d.]+/)[0]) * zoomFactor;
      // document.body.style.transform = `scale(${scale})`;

      console.log(`Zooming ${event.deltaX} ${event.deltaY < 0 ? 'In' : 'Out'}, deltaY: ${event.deltaY}`);
    }

// Handle panning or zooming with the touchpad or mouse without Alt key
    function handlePanningOrZooming(event) {
      // If it's a touchpad or mouse wheel without Alt, zooming and panning can be handled as follows:

      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        // Vertical scroll: Zoom in or out (based on deltaY)
        handleZoom(event); // Zooming functionality for both touchpad or mouse
      } else {
        // Horizontal scroll: Panning the window (left or right)
        handlePanning(event); // Horizontal panning functionality
      }
    }

// Handle panning (scrolling horizontally or vertically)
    function handlePanning(event) {
      // For horizontal panning (deltaX) or vertical panning (deltaY)
      let panX = event.deltaX;
      let panY = event.deltaY;

      // Apply panning (scrolling the window or canvas)
      // window.scrollBy(panX, panY);  // Panning the page/canvas
      console.log(`Panning: deltaX = ${panX}, deltaY = ${panY}`);
    }

// Example: Attach the wheel event handler to the container or document
    /*
    const scrollAgency = document.createElement('div')
    const scrollAgencyChild = document.createElement('div')

    scrollAgency.setAttribute('id', 'scrollAgency')
    scrollAgency.className = 'opacity-100 w-full h-full absolute overflow-scroll z-100'
    scrollAgencyChild.style.width = window.innerWidth + 'px'
    scrollAgencyChild.style.height = window.innerHeight + 'px'
    scrollAgencyChild.innerHTML = '123144'
    scrollAgency.appendChild(scrollAgencyChild)

    this.wrapper.appendChild(scrollAgency)

    scrollAgency.addEventListener('scroll', (e) => {
      console.log('scroll')
      this.scrolling = true
      e.preventDefault()
      e.stopPropagation()
      return false
    }, {signal, passive: false})

    scrollAgency.addEventListener('scrollend', (e) => {
      this.scrolling = false
      console.log('scroll end')

      e.preventDefault()
      e.stopPropagation()
    }, {signal, passive: false})

    scrollAgency.addEventListener('wheel', (e) => {
      console.log('wheel')
      // e.preventDefault()
      e.stopPropagation()
    })



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
        })*/
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