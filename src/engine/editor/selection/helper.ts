import {OperationHandler, ResizeHandler, SelectionActionMode} from './type'
import typeCheck from '../../../utilities/typeCheck.ts'
import Editor from '../editor.ts'
import {RectangleProps} from '../../core/modules/shapes/rectangle.ts'
import {getBoxControlPoints} from '../../lib/lib.ts'

export function modifySelected(this: Editor, idSet: Set<UID>, action: SelectionActionMode) {
  if (typeCheck(idSet) !== 'set' || idSet.size <= 0) return

  let eventCallBackData = null

  if (idSet.size === 1) {
    const first = [...idSet.values()][0]

    if (this.moduleMap.has(first)) {
      eventCallBackData = this.moduleMap.get(first).getDetails()
      // console.log(eventCallBackData)
    }
  }
  const realSelectedModules = this.getSelected

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

  realSelectedModules.forEach(id => this.selectedModules.add(id))
  // this.events.onSelectionUpdated?.(idSet, eventCallBackData)
}

export function updateVisibleSelected(this: Editor) {
  this.visibleSelected.clear()
  this.operationHandlers.clear()

  this.getVisibleModuleMap.forEach(module => {
    if (module.type === 'rectangle') {
      const {x, y, id, width, height, rotation} = module as RectangleProps
      // const points = getBoxControlPoints(x, y, width, height, rotation)

      createHandlersForRect({id, x, y, width, height, rotation}).forEach(p => {
        this.operationHandlers.add(p)
      })
    }

    if (this.selectedModules.has(module.id)) {
      this.visibleSelected.add(module.id)
    }
  })

}

function createHandlersForRect({id, x, y, width, height, rotation}): ResizeHandler[] {
  const localHandleOffsets = [
    {name: 'tl', x: 0, y: 0, cursor: 'nwse-resize'}, // top-left
    {name: 't', x: 0.5, y: 0, cursor: 'ns-resize'}, // top-center
    {name: 'tr', x: 1, y: 0, cursor: 'nesw-resize'}, // top-right
    {name: 'r', x: 1, y: 0.5, cursor: 'ew-resize'}, // right-center
    {name: 'br', x: 1, y: 1, cursor: 'nwse-resize'}, // bottom-right
    {name: 'b', x: 0.5, y: 1, cursor: 'ns-resize'}, // bottom-center
    {name: 'bl', x: 0, y: 1, cursor: 'nesw-resize'}, // bottom-left
    {name: 'l', x: 0, y: 0.5, cursor: 'ew-resize'}, // left-center
  ] as const

  return localHandleOffsets.map((offset) => {
    // Step 1: Local position relative to the center of the rect
    const localX = (offset.x - 0.5) * width
    const localY = (offset.y - 0.5) * height
    // console.log(localX, localY)
    // Step 2: Apply rotation to the local position
    const rotated = rotatePoint(localX, localY, x, y, rotation)
    const rotatedX = x + rotated.x
    const rotatedY = y + rotated.y
    console.log(localX, localY, rotated)
    // Return handler
    return {
      id: `${id}-handle-${offset.name}`,
      type: 'resize',
      cursor: offset.cursor,
      data: {
        x: rotatedX,
        y: rotatedY,
        width: 10,
        position: offset.name, // Position of the handler (e.g., top-left)
      },
    }
  })
}

// Function to rotate a point around the center of the rectangle
function rotatePoint(px: number, py: number, cx: number, cy: number, rotation: number) {
  const dx = px - cx
  const dy = py - cy
  const angle = rotation * (Math.PI / 180)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  console.log(px, py, cx, cy, rotation)

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  }
}