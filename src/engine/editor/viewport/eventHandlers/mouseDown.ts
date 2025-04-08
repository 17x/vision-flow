import Editor from '../../editor.ts'

function handleMouseDown(this: Editor, e: MouseEvent) {
  const inViewport = e.target === this.viewport.wrapper
  const isLeftClick = e.button === 0

  if (!inViewport || !isLeftClick) return

  this.viewport.mouseDownPoint.x = e.clientX - this.viewport.rect!.x
  this.viewport.mouseDownPoint.y = e.clientY - this.viewport.rect!.y

  if (this.viewport.spaceKeyDown) {
    this.manipulationStatus = 'panning'
  } else {
    // hit modules
    if (this.hoveredModules.size > 0) {
      const lastId = [...this.hoveredModules][this.hoveredModules.size - 1]

      if (this.isSelectAll) {
        this.moduleMap.forEach(module => {
          this.draggingModules.add(module.id)
        })
      } else if (this.selectedModules.has(lastId)) {
        this.draggingModules = new Set(this.selectedModules)
      } else {
        this.draggingModules.add(lastId)
      }

      this.manipulationStatus = 'dragging'
    } else {
      this.manipulationStatus = 'mousedown'
      if (!(e.ctrlKey || e.shiftKey || e.metaKey)) {
        // this.editor.clear()
      }
    }
  }
}

export default handleMouseDown
