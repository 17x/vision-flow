import {SelectionActionMode} from './type'
import typeCheck from '../../../utilities/typeCheck.ts'
import Editor from '../editor.ts'
import {RectangleProps} from '../../core/modules/shapes/rectangle.ts'
import {getBoxControlPoints} from '../../lib/lib.ts'

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
  const realSelectedModules = this.getSelectedIdSet()

  this.selectedModules.clear()

  if (action === 'replace') {
    realSelectedModules.clear()
  }

  idSet.forEach((id) => {
    switch (action) {
      case 'add':
        realSelectedModules.add(id)
        break
      case 'delete':
        realSelectedModules.delete(id)
        break
      case 'toggle':
        if (realSelectedModules.has(id)) {
          realSelectedModules.delete(id)
        } else {
          realSelectedModules.add(id)
        }
        break
      case 'replace':
        realSelectedModules.add(id)
        break
    }
  })

  this.isSelectAll = realSelectedModules.size === this.moduleMap.size

  // this.selectedModules.clear()
  if (!this.isSelectAll) {
    realSelectedModules.forEach(id => this.selectedModules.add(id))
  }
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
}