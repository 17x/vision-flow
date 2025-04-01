import Viewport from "../viewport.ts"

function handleWheel(this: Viewport, event: WheelEvent) {

  // Prevent zoom
  event.preventDefault()
  // console.log('wheel')
  // console.log(event)
  // const wheelDelta = event.wheelDelta === 120
  const {zooming, zoom} = switchTouchMode(event)

  if (zooming) {
    // console.log('touch moving',zoom)
    return
  }

  // handle zoom
  if (event.altKey) {
    return false
  }

  console.log('handleWheel')
  // console.log(window.visualViewport.scale)
  if (event.target as HTMLElement !== this.wrapper) return

  this.translateViewport(-event.deltaX, -event.deltaY)
}

const switchTouchMode = (() => {
  const THROTTLE_DISTANCE = 5
  let didShiftByDistance = false
  const DELAY = 500
  let _timer: number | undefined
  let deltaX: number = 0
  let deltaY: number = 0
  const ACTION_THRESHOLD = 5
  const EVENT_BUFFER: WheelEvent[] = []
  let zooming = false
  let zoom = 1
  const moving = false

  return (event: WheelEvent) => {
    clearTimeout(_timer)

    deltaX += event.deltaX
    deltaY += event.deltaY
    EVENT_BUFFER.push(event)

    // Only read RECENT actions
    if (EVENT_BUFFER.length > ACTION_THRESHOLD) {
      EVENT_BUFFER.shift()
    }

    /**
     * 1. Once the touch move event has shifted by certain distance:  @didShiftByDistance
     * it starts a Timer
     * 2. The timer will stop if the touch move event has stopped triggering for a certain time: @delay
     */
    if (!didShiftByDistance) {
      didShiftByDistance = Math.abs(deltaX) > THROTTLE_DISTANCE || Math.abs(deltaY) > THROTTLE_DISTANCE
    }

    if (didShiftByDistance) {
      // eslint-disable-next-line no-compare-neg-zero
      const zoomingIn = EVENT_BUFFER.every(e => e.deltaY < 0 && e.deltaX === -0)
      // eslint-disable-next-line no-compare-neg-zero
      const zoomingOut = EVENT_BUFFER.every(e => e.deltaY > 0 && e.deltaX === -0)

      if (!zooming) {
        zooming = zoomingIn || zoomingOut
      } else {
        console.log('zooming mode')
      }

      zoom = event.deltaY

      if (zoomingIn) {
        zoom = event.deltaY
      } else if (zoomingOut) {
      }
    }

    if (EVENT_BUFFER.length > ACTION_THRESHOLD) {
      EVENT_BUFFER.shift()
    }

    _timer = setTimeout(() => {
      console.log([...EVENT_BUFFER])
      didShiftByDistance = false
      deltaX = 0
      deltaY = 0
      EVENT_BUFFER.length = 0
      zooming = false
    }, DELAY)

    return {
      zooming,
      zoom: 0,
      deltaX,
      deltaY,
    }
  }
})()

export default handleWheel

