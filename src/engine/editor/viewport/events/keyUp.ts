import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleKeyUp(this: Viewport, e: KeyboardEvent) {
  // const _t = e.target !== this.wrapper

  this.altKey = e.altKey
  
}

export default handleKeyUp

