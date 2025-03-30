// import Rectangle from "../../../core/modules/shapes/rectangle.ts"
// import {isInsideRotatedRect} from "../func.ts"
import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

// import render from "../render.ts"

function handleMouseDown(this: Viewport, e: MouseEvent) {
  const _t = e.target !== this.wrapper

  if (_t || this.domResizing) return

  // if (this.editor.panableContainer.isSpaceKeyPressed) return
  const x = e.clientX - this.rect!.x
  const y = e.clientY - this.rect!.y

  // this.isDragging = true
  this.pointMouseDown.x = x
  this.pointMouseDown.y = y
  this.mouseDown = true
  updateSelectionBox(this.selectionBox, {x, y, width: 0, height: 0})
}

export default handleMouseDown
