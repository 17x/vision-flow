import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyDown(this: Viewport, e: KeyboardEvent) {
  // const _t = e.target !== this.wrapper
  if (this.panning) return
  if (this.selecting) return

  if (e.code === 'Space') {
    this.spaceKeyDown = true
    this.wrapper.style.cursor = "grabbing"
    return
  }

  const clickOnModule = false
}

export default handleKeyDown

