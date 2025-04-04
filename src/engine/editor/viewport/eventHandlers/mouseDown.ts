import Viewport from "../viewport.ts"

function handleMouseDown(this: Viewport, e: MouseEvent) {
  const inViewport = e.target === this.wrapper
  const isLeftClick = e.button === 0

  if (!inViewport || !isLeftClick || this.domResizing) return

  this.mouseDownPoint.x = e.clientX - this.rect!.x
  this.mouseDownPoint.y = e.clientY - this.rect!.y

  if (this.spaceKeyDown) {
    this.manipulationStatus = 'panning'
  } else {
    // hit modules
    if (this.hoveredModules.size > 0) {
      const lastId = [...this.hoveredModules][this.hoveredModules.size - 1];

      if (this.editor.selectionManager.isSelectAll) {
        this.editor.moduleMap.forEach(module => {
          this.handlingModules.add(module.id)
        })
      } else if (this.editor.selectionManager.selectedModules.has(lastId)) {
        this.editor.selectionManager.selectedModules.forEach(id => {
          this.handlingModules.add(id)
        })
      } else {
        this.handlingModules.add(lastId)
      }
    } else {
      this.manipulationStatus = 'selecting'
      if (!(e.ctrlKey || e.shiftKey || e.metaKey)) {
        this.editor.selectionManager.clear()
      }
    }
  }
}

export default handleMouseDown
