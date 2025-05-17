export interface ZoomOptions {
  dom: HTMLElement
  mouse?: true,
  touchpad?: true,
  mouseScrollModifier?: 'alt' | 'ctrl'
  onZoom?: (zoomIn: boolean) => void
}

class Zoom {
  protected dom: HTMLElement
  protected mouse: boolean
  protected touchpad: boolean
  protected eventsController: AbortController
  protected onZoom: ZoomOptions['onZoom']
  protected mouseScrollModifier: 'alt' | 'ctrl' | 'shift' | 'meta'
  _timer: number | undefined
  DELAY = 200
  ACTION_THRESHOLD = 3
  EVENT_BUFFER: WheelEvent[] = []
  gestureLock = false
  trackpad = false

  constructor({
                dom,
                mouse = true,
                touchpad = true,
                mouseScrollModifier = 'alt',
                onZoom,
              }: ZoomOptions) {
    this.dom = dom
    this.mouse = mouse
    this.touchpad = touchpad
    this.eventsController = new AbortController()
    this.mouseScrollModifier = mouseScrollModifier
    this.onZoom = onZoom
    this.dom.addEventListener('wheel', this.handleWheel.bind(this), {
      signal: this.eventsController.signal,
      passive: false,
    })
  }

  handleWheel(event: WheelEvent) {
    const {EVENT_BUFFER} = this
    const {deltaX, deltaY, altKey, ctrlKey, shiftKey} = event
    let zoomFactor = .1
    event.preventDefault()
    event.stopPropagation()

    if (this._timer) {
      clearTimeout(this._timer)
    }

    if (this.gestureLock) {
      EVENT_BUFFER.length = 0
    } else {
      EVENT_BUFFER.push(event)
    }

    let translateX = 0
    let translateY = 0
    let zoomIn = false
    let zoomOut = false
    let scrolling = false
    let _zooming = false

    if (altKey) {
      _zooming = true
      // zoomFactor = ~~deltaY < 0 ? -.1 : .1
    }

    if (EVENT_BUFFER.length >= this.ACTION_THRESHOLD) {
      // detect zooming
      const allXAreMinusZero = EVENT_BUFFER.every((e) =>
        Zoom.isNegativeZero(e.deltaX),
      )
      const allYAreFloat = EVENT_BUFFER.every((e) => Zoom.isFloat(e.deltaY))
      const absBiggerThan4 = EVENT_BUFFER.every((e) => Math.abs(e.deltaY) > 4)

      // console.log('detect zooming')

      if (allXAreMinusZero && allYAreFloat && !absBiggerThan4) {
        this.gestureLock = true
        this.trackpad = true
        // console.log('touchpadZoomingLock')
        // console.log([...EVENT_BUFFER])
        // zoomFactor = deltaY > 0 ? -.1 : .1
        // zooming = true
      }
    }

    /**
     * Wheel deltaX deltaY
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
     *      x: UInt, increasing and abs(v) > 40
     *      y === -0
     */
    if (this.gestureLock) {
      // console.log('hit')
      // zoomFactor = deltaY > 0 ? -zoomSpeedA : zoomSpeedA
      zooming = true
    } else if (Math.abs(deltaX) >= 40 && Zoom.isNegativeZero(deltaY)) {
      // Mouse horizontal scrolling
      // console.log('hor scroll', deltaX)
      if (altKey) {
        // zoomFactor = deltaX < 0 ? zoomSpeedB : -zoomSpeedB
      } else {
        scrolling = true
        translateX = -deltaX
      }
    } else if (
      Zoom.isNegativeZero(deltaX) &&
      Zoom.isFloat(deltaY) &&
      Math.abs(deltaY) > 4
    ) {
      // Vertical scrolling
      // console.log('ver scrolling', deltaX)
      if (altKey) {
        // zoomFactor = deltaY < 0 ? zoomSpeedA : -zoomSpeedA
      } else {
        scrolling = true
        translateY = -deltaY
      }
    } else if (Zoom.isUInt(deltaX) && Zoom.isUInt(deltaY)) {
      // panning
      if (altKey) {
        // const max = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY

        // zoomFactor = max < 0 ? zoomSpeedA : -zoomSpeedA
      } else {
        // console.log('panning')
        // panning = true
        translateX = -deltaX
        translateY = -deltaY
      }
    }

    if (zooming && altKey) {
      zoomFactor = zoomFactor < 0 ? -zoomSpeedB : zoomSpeedB
    }

    /*
        _timer = setTimeout(() => {
          gestureLock = false
          zooming = false
          panning = false
          scrolling = false
          zoomFactor = 0
          translateX = 0
          translateY = 0
          EVENT_BUFFER.length = 0
        }, DELAY)
    */

    this.onZoom && this.onZoom({
      trackpad,
      zooming,
      panning,
      scrolling,
      zoomFactor,
      translateX,
      translateY,
    })
  }

  static isUInt(v: number) { return !Zoom.isFloat(v) }

  static isNegativeZero(x: number) {return x === 0 && (1 / x) === -Infinity}

  static isFloat(v: number) { return Math.abs(v) % 1 !== 0 }

  destroy() {
    this.dom = null!
    this.mouse = null!
    this.touchpad = null!
    this.eventsController.abort()
    this.eventsController = null!
  }
}

export default Zoom