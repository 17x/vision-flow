import Editor from '../../editor.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {isInsideRotatedRect} from '../../../core/utils.ts'
import {ResizeHandler} from '../../selection/type'
import {applyResizeTransform} from '../../../lib/lib.ts'

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
    // console.log(operator)
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

export function applyResize(this: Editor, altKey: boolean, shiftKey: boolean) {
  const {mouseDownPoint, mouseMovePoint, scale, dpr} = this.viewport
  const {name: handleName, data: {rotation}, moduleOrigin, id} = this._resizingOperator!
  const {cx, cy, width, height} = moduleOrigin
  const module = this.moduleMap.get(id)

  const r = applyResizeTransform({
    downPoint: mouseDownPoint,
    movePoint: mouseMovePoint,
    dpr,
    scale,
    initialWidth: width,
    initialHeight: height,
    rotation,
    handleName,
    altKey,
    shiftKey,
    initialCX: cx,
    initialCY: cy,
  })

  // return
  module.x = r.x
  module.y = r.y
  module.width = r.width
  module.height = r.height

  return r
}

