import Editor from '../../editor.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {isInsideRotatedRect} from '../../../core/utils.ts'
import {ResizeHandler} from '../../selection/type'

export function updateHoveredModule(this: Editor) {
  const {viewport} = this
  const virtualPoint = this.getWorldPointByViewportPoint(viewport.mouseMovePoint.x, viewport.mouseMovePoint.y)
  let maxLayer = Number.MIN_SAFE_INTEGER
  let moduleId: UID | null = null

  const operationHandlers = [...this.operationHandlers].filter((operationHandler: ResizeHandler) => {
    // console.log(operationHandler.data)
    const {x, y, width, rotation} = operationHandler.data
    const f = isInsideRotatedRect(virtualPoint, {x, y, width, height: width}, rotation)
    return f
  })

  const operator = operationHandlers[operationHandlers.length - 1]

  if (operator) {
    console.log(operator)
    this.action.dispatch('module-hover-enter', operator.id)
    return operator
  }

  this.getVisibleModuleMap.forEach((module) => {
    if (module.type === 'rectangle') {
      // @ts-ignore
      const {id, layer, x, y, width, height, rotation} = (module as Rectangle)
      const f = isInsideRotatedRect(virtualPoint, {x, y, width, height}, rotation)

      if (f) {
        if (layer > maxLayer) {
          maxLayer = layer
          moduleId = id
        }
      }
    }
  })

  if (this.hoveredModule !== moduleId) {
    if (this.hoveredModule) {
      this.action.dispatch('module-hover-leave', this.hoveredModule)
    }

    if (moduleId) {
      this.action.dispatch('module-hover-enter', moduleId)
    }
  }
}
