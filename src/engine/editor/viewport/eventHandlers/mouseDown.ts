// import Rectangle from "../../../core/modules/shapes/rectangle.ts"
// import {isInsideRotatedRect} from "../func.ts"
import Viewport from "../viewport.ts"
import {hoverOnModule} from "../helper.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseDown(this: Viewport, e: MouseEvent) {
  const inViewport = e.target === this.wrapper
  const isLeftClick = e.button === 0

  if (!inViewport || !isLeftClick || this.domResizing) return

  const x = e.clientX - this.rect!.x
  const y = e.clientY - this.rect!.y

  this.mouseDownPoint.x = x
  this.mouseDownPoint.y = y
  this.mouseDown = true

  if (this.spaceKeyDown) {
    this.panning = true
  } else {
    const f = hoverOnModule()

    this.selecting = f

    if (f) {

    } else {

      // this.dragging = true
    }
  }
}

export default handleMouseDown
