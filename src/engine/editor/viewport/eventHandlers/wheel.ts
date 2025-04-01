import Viewport from "../viewport.ts"

function handleWheel(this: Viewport, event: WheelEvent) {
  // Prevent page zoom
  if (event.target as HTMLElement !== this.wrapper) return
  event.preventDefault()

  const r = switchTouchMode(event)
  const {zooming, panning, scrolling, zoomFactor, translateX, translateY} = r
  console.log(translateX, translateY)
  if (zooming) {
    // console.log('zooming')
    this.zoom(zoomFactor)
  }else{
    this.translateViewport(translateX, translateY)

  }

  if (panning || scrolling) {
    // console.log('panning')
  }
}

const switchTouchMode = (() => {
  // const THROTTLE_DISTANCE = 100
  // let didShiftByDistance = false
  // const DELAY = 500
  // let _timer: number | undefined
  let shiftX: number = 0
  let shiftY: number = 0
  const ACTION_THRESHOLD = 3
  const EVENT_BUFFER: WheelEvent[] = []
  let zooming = false
  let panning = false
  let scrolling = false
  let zoomFactor = 1
  let translateX = 0
  let translateY = 0

  return (event: WheelEvent) => {
    // clearTimeout(_timer)

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
     *      x: UInt, increasing and abs(v) > 40
     *      y === -0
     */
    const {deltaX, deltaY} = event
    // console.log('wheel', deltaX, deltaY)

    // console.log(isUInt(deltaX), isUInt(deltaY))

    zooming = false
    panning = false
    scrolling = false
    zoomFactor = 1
    translateX = -deltaX
    translateY = -deltaY

    if (EVENT_BUFFER.length >= ACTION_THRESHOLD) {
      const conditionOnX0 = EVENT_BUFFER.every(e => e.deltaX === -0)
      const conditionOnY1 = EVENT_BUFFER.every(e => isFloat(e.deltaY))
      const conditionOnY2 = EVENT_BUFFER.every(e => Math.abs(e.deltaY) > 4)
      const mouseScrollHorizontalFlag = EVENT_BUFFER.every(e => (Math.abs(e.deltaX) >= 40) && isUInt(e.deltaX) && e.deltaY === -0)

      if (conditionOnX0 && conditionOnY1) {
        if (conditionOnY2) {
          scrolling = true
          translateY = -deltaY
        } else {
          zoomFactor = 0.9
          zooming = true
        }
      } else if (mouseScrollHorizontalFlag) {
        scrolling = true
        translateX = -deltaX
      }
    } else {
      if (isUInt(deltaX) && isUInt(deltaY)) {
        panning = true
        translateX = -deltaX
        translateY = -deltaY
      }
    }

    /* _timer = setTimeout(() => {
       // console.log([...EVENT_BUFFER])
       didShiftByDistance = false
       shiftX = 0
       shiftY = 0
       EVENT_BUFFER.length = 0
       zooming = false
       panning = false
     }, DELAY)*/

    return {
      zooming,
      panning,
      scrolling,
      zoomFactor,
      translateX,
      translateY,
    }
  }
})()

function isUInt(v: number) {return !isFloat(v)}

function isFloat(v: number) {return Math.abs(v) % 1 !== 0}

export default handleWheel

