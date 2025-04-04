import Viewport from "../viewport.ts"
import {isNegativeZero} from "../../../lib/lib.ts";

function handleWheel(this: Viewport, event: WheelEvent) {
  // Prevent page zoom
  if (event.target as HTMLElement !== this.wrapper) return
  // console.log(this.manipulationStatus)
  event.preventDefault()
  event.stopPropagation()

  const {zooming, panning, scrolling, zoomFactor, translateX, translateY} = detectGestures(event)

  console.log(zooming, panning)

  this.zooming = zooming

  if (zooming) {
    const shiftX = (this.mouseMovePoint.x - this.offset.x) / this.zoom
    const shiftY = (this.mouseMovePoint.y - this.offset.y) / this.zoom

    // console.log(zoomFactor)
    this.scale(zoomFactor)
    // this.setTranslateViewport(shiftX, shiftY)
  } else if (panning || scrolling) {
    this.translateViewport(translateX, translateY)
  }

  this.updateVirtualRect()
}

const detectGestures = (() => {
  let _timer: number | undefined
  const DELAY = 200
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
    if (!zooming) {
      EVENT_BUFFER.push(event)

      // Only read RECENT actions
      if (EVENT_BUFFER.length > ACTION_THRESHOLD) {
        EVENT_BUFFER.shift()
      }
    }

    clearTimeout(_timer)

    const {deltaX, deltaY} = event

    // console.log(event)
    if (zooming) {
      // zooming = true
      zoomFactor = deltaY > 0 ? -.1 : .1
      EVENT_BUFFER.length = 0
    } else {
      translateX = -deltaX
      translateY = -deltaY
      if (event.altKey) {
        console.log(deltaX, deltaY)
        zooming = true
        zoomFactor = deltaY > 0 ? -.1 : .1
      } else {

        console.log(deltaX, deltaY)
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
          const allXAreMinusZero = EVENT_BUFFER.every(e => isNegativeZero(e.deltaX))
          const allYAreFloat = EVENT_BUFFER.every(e => isFloat(e.deltaY))
          const absBiggerThan4 = EVENT_BUFFER.every(e => Math.abs(e.deltaY) > 4)
          const mouseScrollHorizontalFlag = EVENT_BUFFER.every(e => (Math.abs(e.deltaX) >= 40) && isUInt(e.deltaX) && isNegativeZero(e.deltaY))

          if (allXAreMinusZero && allYAreFloat) {
            if (absBiggerThan4) {
              scrolling = true
              translateY = -deltaY
            } else {
              console.log([...EVENT_BUFFER])
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
      EVENT_BUFFER.length = 0
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

