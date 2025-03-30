import Viewport from "../viewport.ts"
import {updateSelectionBox} from "../domManipulations.ts"

function handleMouseMove(this: Viewport, e: MouseEvent) {
  if (this.domResizing) return

  const x = e.clientX - this.rect!.x
  const y = e.clientY - this.rect!.y

  this.pointMouseCurrent.x = x
  this.pointMouseCurrent.y = y

  if (this.mouseDown) {
    let boxX = this.pointMouseDown.x
    let boxY = this.pointMouseDown.y
    let boxWidth = this.pointMouseCurrent.x - this.pointMouseDown.x
    let boxHeight = this.pointMouseCurrent.y - this.pointMouseDown.y

    if (boxWidth < 0) {
      boxX = this.pointMouseCurrent.x
      boxWidth = this.pointMouseDown.x - this.pointMouseCurrent.x
    }

    if (boxHeight < 0) {
      boxY = this.pointMouseCurrent.y
      boxHeight = this.pointMouseDown.y - this.pointMouseCurrent.y
    }
    updateSelectionBox(this.selectionBox, {x: boxX, y: boxY, width: boxWidth, height: boxHeight})
  }
}

export default handleMouseMove
