import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleWheel(this: Viewport, event: WheelEvent) {
  // Prevent zoom
  event.preventDefault()

  // Focus on current dom
  if (event.target as HTMLElement !== this.wrapper) return

  // Deal zoom
  if (event.altKey) {
    // const idx = Math.round(e.deltaY / 4)
    const idx = event.deltaY > 0 ? -1 : 1
    // console.log(idx)
    this.zoom(idx)
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
    const { scale, offsetX, offsetY } = calculateZoom(viewport, event.clientX, event.clientY, zoomFactor)
    this.updateZoom(scale, offsetX, offsetY)

  } else {
    console.log(event.deltaX, event.deltaY)
  }
}

export default handleWheel

