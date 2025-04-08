import Editor from '../../editor.ts'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: Editor, e: KeyboardEvent) {
  if (e.code === 'Space') {
    this.viewport.spaceKeyDown = false
    this.viewport.wrapper.style.cursor = 'default'
  }
}

export default handleKeyUp

