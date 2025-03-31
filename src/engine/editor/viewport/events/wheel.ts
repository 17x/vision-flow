import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleWheel(this: Viewport, e: WheelEvent) {
  // Prevent zoom
  e.preventDefault()

  // Focus on current dom
  if (e.target as HTMLElement !== this.wrapper) return

  // Deal zoom
  if (e.altKey) {
    // const idx = Math.round(e.deltaY / 4)
    const idx = e.deltaY > 0 ? -1 : 1
    // console.log(idx)
    this.zoom(idx)
  } else {
    console.log(e.deltaX, e.deltaY)
  }
}

export default handleWheel

