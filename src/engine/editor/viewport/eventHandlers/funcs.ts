import Editor from '../../editor.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {isInsideRotatedRect} from '../../../core/utils.ts'

export function updateHoveredModules(this: Editor) {
  const {viewport, hoveredModules} = this
  const virtualPoint = this.getWorldPointByViewportPoint(viewport.mouseMovePoint.x, viewport.mouseMovePoint.y)

  hoveredModules.clear()
  this.getVisibleModuleMap.forEach((module) => {
    if (module.type === 'rectangle') {
      const {x, y, width, height, rotation} = (module as Rectangle)
      const f = isInsideRotatedRect(virtualPoint, {x, y, width, height}, rotation)

      if (f) {
        hoveredModules.add(module.id)
      }
    }
  })
}