import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: Viewport, e: KeyboardEvent) {
  console.log(e.code)
  if (e.code === 'Space') {
    this.spaceKeyDown = false
    this.panning = false
    this.wrapper.style.cursor = "default"
  }
}

export default handleKeyUp

