import Viewport from "../viewport.ts"

function handleWheel(this: Viewport, event: WheelEvent) {
  // Prevent page zoom
  if (event.target as HTMLElement !== this.wrapper) return
  event.preventDefault()

  const {zooming, panning, zoomFactor, translateX, translateY} = detectGestures(event)
  // console.log(translateX, translateY)
  this.panning = panning
  this.zooming = zooming

  if (zooming) {
    this.scale(zoomFactor)
  } else {
    // console.log('pad')
    this.translateViewport(translateX, translateY)
  }
}

const detectGestures = (() => {
  let _timer: number | undefined
  const DELAY = 300
  // let shiftX: number = 0
  // let shiftY: number = 0
  const ACTION_THRESHOLD = 3
  const EVENT_BUFFER: WheelEvent[] = []
  let zooming = false
  let panning = false
  let scrolling = false
  let zoomFactor = 0
  let translateX = 0
  let translateY = 0

  return (event: WheelEvent) => {
    EVENT_BUFFER.push(event)

    // Only read RECENT actions
    if (EVENT_BUFFER.length > ACTION_THRESHOLD) {
      EVENT_BUFFER.shift()
    }

    clearTimeout(_timer)

    const {deltaX, deltaY} = event

    // zooming = false
    /* panning = false
     scrolling = false
     zoomFactor = 0
     translateX = -deltaX
     translateY = -deltaY*/

    if (zooming) {
      // zooming = true
      zoomFactor = deltaY > 0 ? -.1 : .1
    } else {
      translateX = -deltaX
      translateY = -deltaY
      if (event.altKey) {
        zooming = true
        zoomFactor = deltaY > 0 ? -.1 : .1
      } else {
        if (EVENT_BUFFER.length >= ACTION_THRESHOLD) {
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
          const conditionOnX0 = EVENT_BUFFER.every(e => e.deltaX === -0)
          const conditionOnY1 = EVENT_BUFFER.every(e => isFloat(e.deltaY))
          const conditionOnY2 = EVENT_BUFFER.every(e => Math.abs(e.deltaY) > 4)
          const mouseScrollHorizontalFlag = EVENT_BUFFER.every(e => (Math.abs(e.deltaX) >= 40) && isUInt(e.deltaX) && e.deltaY === -0)

          if (conditionOnX0 && conditionOnY1) {
            if (conditionOnY2) {
              scrolling = true
              translateY = -deltaY
            } else {
              zoomFactor = deltaY > 0 ? -.1 : .1
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
      }
    }

    _timer = setTimeout(() => {
      zooming = false
      panning = false
      scrolling = false
      zoomFactor = 0
      translateX = -deltaX
      translateY = -deltaY
    }, DELAY)

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

