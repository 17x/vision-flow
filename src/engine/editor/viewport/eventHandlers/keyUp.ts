import Editor from '../../editor.ts'
import {applyResize} from './funcs.ts'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: Editor, e: KeyboardEvent) {
  if (e.code === 'Space') {
    this.viewport.spaceKeyDown = false
    this.viewport.wrapper.style.cursor = 'default'
  }

  if (this.manipulationStatus === 'resizing') {
    applyResize.call(this, e.altKey, e.shiftKey)
    this.action.dispatch('visible-module-update')
  }
}

export default handleKeyUp

