import Viewport from "../viewport.ts"

function handleWheel(this: Viewport, event: WheelEvent) {
  // Prevent page zoom
  if (event.target as HTMLElement !== this.wrapper) return
  event.preventDefault()

  const {zooming, panning} = switchTouchMode(event)

  if (zooming) {
    console.log('zooming')
  }

  if (panning) {
    console.log('panning')
  }
  // this.zoom(zoom)
  // this.translateViewport(translateX, translateY)
}

const switchTouchMode = (() => {
  const THROTTLE_DISTANCE = 100
  let didShiftByDistance = false
  const DELAY = 500
  let _timer: number | undefined
  let shiftX: number = 0
  let shiftY: number = 0
  const ACTION_THRESHOLD = 5
  const EVENT_BUFFER: WheelEvent[] = []
  let zooming = false
  let zoom = 1
  let panning = false

  return (event: WheelEvent) => {
    clearTimeout(_timer)

    shiftX += event.deltaX
    shiftY += event.deltaY
    EVENT_BUFFER.push(event)

    // Only read RECENT actions
    if (EVENT_BUFFER.length > ACTION_THRESHOLD) {
      EVENT_BUFFER.shift()
    }
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

    zooming = false
    panning = false

    if (EVENT_BUFFER.length >= ACTION_THRESHOLD) {
      const mouseScrollVerticalFlag = EVENT_BUFFER.every(e => e.deltaX === -0 && Math.abs(e.deltaY) > 4)
      const mouseScrollHorizontalFlag = EVENT_BUFFER.every(e => (Math.abs(e.deltaX) >= 40) && isUInt(e.deltaX) && e.deltaY === -0)
      const touchPadZoomFlag = EVENT_BUFFER.every(e => e.deltaX === -0 && isFloat(e.deltaY))

      // zooming = !mouseScrollVerticalFlag && touchPadZoomFlag
      // console.log(mouseScrollVerticalFlag, mouseScrollHorizontalFlag)

      if (!mouseScrollVerticalFlag) {
        zooming = !mouseScrollVerticalFlag && touchPadZoomFlag
      } else {
        // scrolling
        panning = mouseScrollHorizontalFlag
      }
    } else {
      if (isUInt(deltaX) && isUInt(deltaY)) {
        panning = true
      }
    }

    /**
     * 1. Once the touch move event has shifted by certain distance:  @didShiftByDistance
     * it starts a Timer
     * 2. The timer will stop if the touch move event has stopped triggering for a certain time: @delay
     */

    _timer = setTimeout(() => {
      // console.log([...EVENT_BUFFER])
      didShiftByDistance = false
      shiftX = 0
      shiftY = 0
      EVENT_BUFFER.length = 0
      zooming = false
      panning = false
    }, DELAY)

    return {
      zooming,
      zoom: 0,
      shiftX,
      shiftY,
    }
  }
})()

function isUInt(v: number) {return !isFloat(v)}

function isFloat(v: number) {return Math.abs(v) % 1 !== 0}

export default handleWheel

