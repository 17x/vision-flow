// import Rectangle from "../../../core/modules/shapes/rectangle.ts"
// import {isInsideRotatedRect} from "../func.ts"
import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseDown(this: Viewport, e: MouseEvent) {
  const inViewport = e.target === this.wrapper
  const isLeftClick = e.button === 0

  if (!inViewport || !isLeftClick || this.domResizing) return

  this.mouseDownPoint.x = e.clientX - this.rect!.x
  this.mouseDownPoint.y = e.clientY - this.rect!.y
  this.mouseDown = true

  if (this.spaceKeyDown) {
    this.panning = true
  } else {

    this.selecting = true
    // this.dragging = true

  }
}

export default handleMouseDown
