import Editor from '../../editor.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {isInsideRotatedRect} from '../../../core/utils.ts'
import {OperationHandlers, RotateHandler} from '../../selection/type'
import {applyResizeTransform} from '../../../lib/lib.ts'

export function updateHoveredModule(this: Editor) {
  const {viewport} = this
  const virtualPoint = this.getWorldPointByViewportPoint(
    viewport.mouseMovePoint.x,
    viewport.mouseMovePoint.y,
  )
  let maxLayer = Number.MIN_SAFE_INTEGER
  let moduleId: UID | null = null

  const operationHandlers = [...this.operationHandlers].filter(
    (operationHandler: OperationHandlers) => {
      const {x, y, size, rotation} = operationHandler.data

      return isInsideRotatedRect(
        virtualPoint,
        {x, y, width: size, height: size},
        rotation,
      )
    },
  )

  const operator = operationHandlers[operationHandlers.length - 1]

  if (operator) {
    console.log(operator)
    this.action.dispatch('module-hover-enter', operator.id)
    return operator
  }

  this.getVisibleModuleMap.forEach((module) => {
    if (module.type === 'rectangle') {
      // @ts-ignore
      const {id, layer, x, y, width, height, rotation} = module as Rectangle
      const f = isInsideRotatedRect(
        virtualPoint,
        {x, y, width, height},
        rotation,
      )

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
  const {
    name: handleName,
    data: {rotation},
    moduleOrigin,
    id,
  } = this._resizingOperator!
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

export function applyRotating(this: Editor, shiftKey: boolean) {
  const {mouseDownPoint, mouseMovePoint, scale, dpr} = this.viewport
  const {data: {rotation}, moduleOrigin, id} = this._rotatingOperator as RotateHandler
  const {cx, cy} = moduleOrigin
  const module = this.moduleMap.get(id)

  // Convert screen coordinates to canvas coordinates
  const downX = (mouseDownPoint.x - this.viewport.offset.x) / scale * dpr
  const downY = (mouseDownPoint.y - this.viewport.offset.y) / scale * dpr
  const moveX = (mouseMovePoint.x - this.viewport.offset.x) / scale * dpr
  const moveY = (mouseMovePoint.y - this.viewport.offset.y) / scale * dpr

  // Calculate the angle between the mouse position and the center of the object
  const startAngle = Math.atan2(downY - cy, downX - cx)
  const currentAngle = Math.atan2(moveY - cy, moveX - cx)

  // Calculate the rotation delta in degrees
  let rotationDelta = (currentAngle - startAngle) * (180 / Math.PI)

  // Snap to 15-degree increments if shift key is pressed
  if (shiftKey) {
    rotationDelta = Math.round(rotationDelta / 15) * 15
  }

  // Apply the rotation
  module.rotation = rotation + rotationDelta

  return {
    rotation: module.rotation,
  }
}
