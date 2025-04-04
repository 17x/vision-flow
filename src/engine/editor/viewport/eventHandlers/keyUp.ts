import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: Viewport, e: KeyboardEvent) {
  if (e.code === 'Space') {
    this.spaceKeyDown = false
    this.wrapper.style.cursor = "default"
  }
}

export default handleKeyUp

