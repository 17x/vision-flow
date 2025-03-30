import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleContextMenu(this: Viewport, e: WheelEvent) {
  // const _t = e.target !== this.wrapper
  console.log(e.deltaY)
}

export default handleContextMenu

