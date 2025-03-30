import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleContextMenu(this: Viewport, e: MouseEvent) {
  // const _t = e.target !== this.wrapper
  // console.log(e.deltaY)
  console.log(e)
  e.preventDefault()
  e.stopPropagation()
}

export default handleContextMenu

