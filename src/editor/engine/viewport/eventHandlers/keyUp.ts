import Editor from '../../editor.ts'
import {applyResize} from './funcs.ts'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: Editor, e: KeyboardEvent) {
  if (e.code === 'Space') {
    this.viewport.spaceKeyDown = false
    this.viewport.wrapper.style.cursor = 'default'
  }

  if (this.manipulationStatus === 'resizing') {
    const {altKey, shiftKey} = e

    const r = applyResize.call(this, altKey, shiftKey)

    this.action.dispatch('module-modifying', {
      type: 'resize',
      data: r,
    })
  }
}

export default handleKeyUp

