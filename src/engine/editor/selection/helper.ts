import {ResizeHandler, SelectionActionMode} from './type'
import typeCheck from '../../../utilities/typeCheck.ts'
import Editor from '../editor.ts'
import {RectangleProps} from '../../core/modules/shapes/rectangle.ts'

export function modifySelected(
  this: Editor,
  idSet: Set<UID>,
  action: SelectionActionMode,
) {
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

  realSelectedModules.forEach((id) => this.selectedModules.add(id))
  // this.events.onSelectionUpdated?.(idSet, eventCallBackData)
}

export function updateVisibleSelected(this: Editor) {
  this.visibleSelected.clear()
  this.operationHandlers.clear()
  const localHandlerWidth = 10
  const localHandlerBorderWidth = 1
  const size = this.selectedModules.size
  console.log()

  this.getVisibleModuleMap.forEach((module) => {
    if (this.selectedModules.has(module.id)) {
      this.visibleSelected.add(module.id)

    }
  })

  this.getVisibleSelectedModuleMap.forEach((module) => {
    if (size === 1 && this.selectedModules.has(module.id)) {
      if (module.type === 'rectangle') {
        const {x: cx, y: cy, id, width, height, rotation} = module as RectangleProps

        createHandlersForRect({id, cx, cy, width, height, rotation}).forEach(
          (p) => {
            p.data.width = localHandlerWidth / this.viewport.scale * this.viewport.dpr
            p.data.lineWidth = localHandlerBorderWidth / this.viewport.scale * this.viewport.dpr
            // console.log(this.viewport.scale, this.viewport.dpr, p.data.width)
            this.operationHandlers.add(p)
          },
        )
      }
    }

  })

  // console.log(this.getVisibleSelectedModuleMap)

}

function createHandlersForRect({
                                 id,
                                 cx,
                                 cy,
                                 width,
                                 height,
                                 rotation,
                               }: {
  id: string;
  cx: number;
  cy: number;
  width: number;
  height: number;
  rotation: number;
}): ResizeHandler[] {
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
    // Calculate the handle position in local coordinates
    const handleX = cx - width / 2 + offset.x * width
    const handleY = cy - height / 2 + offset.y * height

    // Rotate the handle position around the center
    const rotated = rotatePoint(handleX, handleY, cx, cy, rotation)

    return {
      id: `${id}-handle-${offset.name}`,
      type: 'resize',
      cursor: offset.cursor,
      data: {
        x: rotated.x,
        y: rotated.y,
        width: 0,
        position: offset.name,
        rotation,
      },
    }
  })
}

// Function to rotate a point around the center of the rectangle
function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  rotation: number,
) {
  const dx = px - cx
  const dy = py - cy
  const angle = rotation * (Math.PI / 180)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  }
}
