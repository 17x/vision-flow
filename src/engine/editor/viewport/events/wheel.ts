import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleWheel(this: Viewport, e: WheelEvent) {
  // const _t = e.target !== this.wrapper
  if (e.altKey) {
    // const idx = Math.round(e.deltaY / 4)
    const idx = e.deltaY > 0 ? -1 : 1
    // console.log(idx)
    this.zoom(idx)
  }
}

export default handleWheel

