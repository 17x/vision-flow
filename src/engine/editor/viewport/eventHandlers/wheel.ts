import Viewport from "../viewport.ts"

function handleWheel(this: Viewport, event: WheelEvent) {
  // Prevent zoom
  event.preventDefault()

  if (event.target as HTMLElement !== this.wrapper) return

  const f = detectTouchMoving(event)
  if (f) {
    console.log('touch moving')
  }
  return
  // Deal zoom
  if (event.altKey) {
    const idx = event.deltaY > 0 ? -1 : 1
    this.zoom(idx)
    // const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
    // const {scale, offsetX, offsetY} = calculateZoom(viewport, event.clientX, event.clientY, zoomFactor)
    // this.updateZoom(scale, offsetX, offsetY)
  } else {
    // console.log(event.deltaX, event.deltaY)
    console.log(event.deltaX, event.deltaY)
    return
    const zooming = handleZoom(event)
    if (!zooming) {
      this.translateViewport(-event.deltaX, -event.deltaY)
    }
  }
}

const detectTouchMoving = (() => {
  const throttleDistance = 5
  let didShiftByDistance = false
  const delay = 500
  let _timer: number | undefined
  let deltaX: number = 0
  let deltaY: number = 0

  return (event: WheelEvent) => {
    clearTimeout(_timer)

    deltaX += event.deltaX
    deltaY += event.deltaY

    /**
     * 1. Once the touch move event has shifted by certain distance:  @didShiftByDistance
     * it starts a Timer
     * 2. The timer will stop if the touch move event has stopped triggering for a certain time: @delay
     */
    if (!didShiftByDistance) {
      didShiftByDistance = Math.abs(deltaX) > throttleDistance || Math.abs(deltaY) > throttleDistance
    }

    if (didShiftByDistance) {
      console.log(deltaX, deltaY)
      console.log(event.deltaX, event.deltaY)
    }
    _timer = setTimeout(() => {
      didShiftByDistance = false
      deltaX = 0
      deltaY = 0
    }, delay)

    return didShiftByDistance
  }
})()

export default handleWheel

