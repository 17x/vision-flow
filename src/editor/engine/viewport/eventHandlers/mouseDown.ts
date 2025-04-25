import Editor from '../../editor.ts'
import {detectHoveredModule} from './funcs.ts'

function handleMouseDown(this: Editor, e: MouseEvent) {
  const {shiftKey, clientY, target, button, clientX, metaKey, ctrlKey} =
    e
  if (!(target === this.viewport.wrapper)) return
  // const inViewport = target === this.viewport.wrapper
  // const isLeftClick = button !== 0
  const modifyKey = ctrlKey || metaKey || shiftKey

  const x = clientX - this.viewport.rect!.x
  const y = clientY - this.viewport.rect!.y

  this.viewport.mouseDownPoint.x = x
  this.viewport.mouseDownPoint.y = y
  this.viewport.mouseMovePoint.x = x
  this.viewport.mouseMovePoint.y = y

  const operator = detectHoveredModule.call(this)
  // console.log(operator)
  e.preventDefault()
  if (button !== 0) return

  if (this.viewport.spaceKeyDown) {
    return (this.manipulationStatus = 'panning')
  }

  if (operator) {
    if (operator.type === 'resize') {
      this._resizingOperator = operator
      return (this.manipulationStatus = 'resizing')
    } else if (operator.type === 'rotate') {
      this._rotatingOperator = operator
      return (this.manipulationStatus = 'rotating')
    }
  }

  const hoveredModule = this.hoveredModule
  // console.log(hoveredModule)
  // Click on blank area and not doing multi-selection
  if (!hoveredModule) {
    // Determine clear selected modules
    if (!modifyKey) {
      this.action.dispatch('selection-clear')
    }
    this.selectedShadow = this.getSelected
    // console.warn(this.selectedShadow)
    return (this.manipulationStatus = 'selecting')
  }

  this.manipulationStatus = 'dragging'
  const realSelected = this.getSelected

  // this.draggingModules = new Set(this.selectedModules)
  const isSelected = realSelected.has(hoveredModule)
  // console.log(isSelected)
  if (realSelected.size === 0 || (!isSelected && !modifyKey)) {
    // Initial selection or replace selection without modifier key
    this.action.dispatch('selection-modify', {
      mode: 'replace',
      idSet: new Set([hoveredModule]),
    })
    this.draggingModules = new Set([hoveredModule])
  } else if (modifyKey) {
    this.draggingModules = new Set(realSelected)

    if (isSelected) {
      console.log('isSelected', isSelected)
      this._deselection = hoveredModule
      this.draggingModules.add(hoveredModule)
    } else {
      // Add to existing selection
      this.action.dispatch('selection-modify', {
        mode: 'add',
        idSet: new Set([hoveredModule]),
      })
    }
    this.draggingModules.add(hoveredModule)
  } else {
    // Dragging already selected module(s)
    this.draggingModules = new Set(realSelected)
  }
}

export default handleMouseDown
