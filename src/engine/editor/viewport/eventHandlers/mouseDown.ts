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
          this.handlingModules.add(module.id)
        })
      } else if (this.selectedModules.has(lastId)) {
        this.selectedModules.forEach(id => {
          this.handlingModules.add(id)
        })
      } else {
        this.handlingModules.add(lastId)
      }
    } else {
      this.manipulationStatus = 'selecting'
      if (!(e.ctrlKey || e.shiftKey || e.metaKey)) {
        // this.editor.clear()
      }
    }
  }
}

export default handleMouseDown
