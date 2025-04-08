import Editor from '../../editor.ts'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyDown(this: Editor, e: KeyboardEvent) {
  // const _t = e.target !== this.wrapper
  if (this.manipulationStatus === 'panning' || this.manipulationStatus === 'selecting') return

  if (e.code === 'Space') {
    this.viewport.spaceKeyDown = true
    this.viewport.wrapper.style.cursor = "grabbing"
    e.preventDefault()
    return
  }
}

export default handleKeyDown

