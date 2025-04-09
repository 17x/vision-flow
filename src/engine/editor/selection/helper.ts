import {SelectionActionMode} from './type'
import typeCheck from '../../../utilities/typeCheck.ts'
import Editor from '../editor.ts'
import {RectangleProps} from '../../core/modules/shapes/rectangle.ts'
import {getBoxControlPoints} from '../../lib/lib.ts'
// import {SelectionModifyData} from '../actions/type'

export function modifySelection(this: Editor, idSet: Set<UID>, action: SelectionActionMode) {
  if (typeCheck(idSet) !== 'set' || idSet.size <= 0) return

  let eventCallBackData = null

  if (idSet.size === 1) {
    const first = [...idSet.values()][0]

    if (this.moduleMap.has(first)) {
      eventCallBackData = this.moduleMap.get(first).getDetails()
      // console.log(eventCallBackData)
    }
  }

  if (action === 'replace') {
    this.selectedModules.clear()
  }
  console.log(action)
  idSet.forEach((id) => {
    switch (action) {
      case 'add':
        this.selectedModules.add(id)
        break
      case 'delete':
        this.selectedModules.delete(id)
        break
      case 'toggle':
        if (this.selectedModules.has(id)) {
          this.selectedModules.delete(id)
        } else {
          this.selectedModules.add(id)
        }
        break
      case 'replace':
        this.selectedModules.add(id)
        break
    }

    console.log(this.selectingModules)
  })

  // this.events.onSelectionUpdated?.(idSet, eventCallBackData)
}

export function updateVisibleSelectedModules(this: Editor) {
  const visibleModuleMap = this.getVisibleModuleMap()
  this.visibleSelectedModules.clear()
  this.operationHandlers.clear()

  visibleModuleMap.forEach(module => {
    if (module.type === 'rectangle') {
      const {x, y, id, width, height, rotation} = module as RectangleProps
      const points = getBoxControlPoints(x, y, width, height, rotation)

      points.forEach(point => {
        // create manipulation handlers
        this.operationHandlers.add(
          {
            id,
            type: 'resize',
            data: {
              ...point,
              r: this.viewport.scale,
            },
          },
        )
      })
    }

    if (this.isSelectAll) {
      visibleModuleMap.forEach(module => {
        this.visibleSelectedModules.add(module.id)
      })
    } else {
      if (this.selectedModules.has(module.id)) {
        this.visibleSelectedModules.add(module.id)
      }
    }
  })
}/*

export function initSelection(this: Editor) {

  this.action.on('select-all', () => {
    this.selectedModules.clear()
    this.isSelectAll = true
    this.dispatchVisibleSelectedModules()
    // this.events.onSelectionUpdated?.('all', null)
  })

  this.action.on('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.modifySelection(idSet, mode)
    this.dispatchVisibleSelectedModules()
  })

  this.action.on('selection-clear', () => {
    this.selectedModules.clear()
    this.isSelectAll = false
    this.dispatchVisibleSelectedModules()
  })
  this.action.on('module-delete', () => {
    this.selectedModules.clear()
    this.isSelectAll = false
    this.dispatchVisibleSelectedModules()
  })
}*/