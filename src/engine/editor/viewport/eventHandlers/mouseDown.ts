import Editor from '../../editor.ts'
import {updateHoveredModules} from './funcs.ts'

function handleMouseDown(this: Editor, e: MouseEvent) {
  const {shiftKey, clientY, target, /*button,*/ clientX, metaKey, ctrlKey} = e

  if (!(target === this.viewport.wrapper)) return
  // const inViewport = target === this.viewport.wrapper
  // const isLeftClick = button === 0
  const modifyKey = ctrlKey || metaKey || shiftKey

  const x = clientX - this.viewport.rect!.x
  const y = clientY - this.viewport.rect!.y

  this.viewport.mouseDownPoint.x = x
  this.viewport.mouseDownPoint.y = y
  this.viewport.mouseMovePoint.x = x
  this.viewport.mouseMovePoint.y = y
  updateHoveredModules.call(this)
  e.preventDefault()

  if (this.viewport.spaceKeyDown) {
    return this.manipulationStatus = 'panning'
  }

  const closestId = [...this.hoveredModules][this.hoveredModules.size - 1]

  // Click on blank area and not doing multi-selection
  if (!closestId) {
    // Determine clear selected modules
    if (!modifyKey) {
      this.action.dispatch({type: 'selection-clear'})
    }
    this.selectedShadow = this.getSelectedIdSet()
    console.warn(this.selectedShadow)
    return this.manipulationStatus = 'selecting'
  }

  this.manipulationStatus = 'dragging'
  const realSelected = this.getSelectedIdSet()

  // Drag all
  if (this.isSelectAll) {
    realSelected.forEach(id => {
      this.draggingModules.add(id)
    })

    this._deselection = closestId

    return
  }

  // this.draggingModules = new Set(this.selectedModules)
  const isSelected = realSelected.has(closestId)

  if (realSelected.size === 0 || (!isSelected && !modifyKey)) {
    // Initial selection or replace selection without modifier key
    this.action.dispatch({
      type: 'selection-modify',
      data: {
        mode: 'replace',
        idSet: new Set([closestId]),
      },
    })
    this.draggingModules = new Set([closestId])
  } else if (modifyKey) {
    this.draggingModules = new Set(realSelected)

    if (isSelected) {
      console.log('isSelected', isSelected)
      this._deselection = closestId
      this.draggingModules.add(closestId)
    } else {
      // Add to existing selection
      this.action.dispatch({
        type: 'selection-modify',
        data: {
          mode: 'add',
          idSet: new Set([closestId]),
        },
      })
    }
    this.draggingModules.add(closestId)

  } else {
    // Dragging already selected module(s)
    this.draggingModules = new Set(realSelected)
  }

}

export default handleMouseDown
