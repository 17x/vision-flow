import Editor from '../../editor.ts'
// import {isInsideRotatedRect} from '../../../core/utils.ts'
import {RotateHandler} from '../../selection/type'
import {applyResizeTransform} from '../../../lib/lib.ts'

export function detectHoveredModule(this: Editor) {
  const {viewport} = this
  const worldPoint = this.getWorldPointByViewportPoint(
    viewport.mouseMovePoint.x,
    viewport.mouseMovePoint.y,
  )
  // const maxLayer = Number.MIN_SAFE_INTEGER
  let moduleId: UID | null = null

  // console.log(this.operationHandlers)
  const operationHandlers = [...this.operationHandlers].filter(
    (operationHandler) => {
      return operationHandler.module.hitTest(worldPoint)
    },
  )

  const operator = operationHandlers[operationHandlers.length - 1]

  if (operator) {
    // console.log(operator)
    this.action.dispatch('module-hover-enter', operator.id)
    return operator
  }

  const arr = [...this.getVisibleModuleMap.values()]

  for (let i = arr.length - 1; i >= 0; i--) {
    const module = arr[i]
    const hitTest = module.hitTest(worldPoint)
    if (hitTest) {
      // console.log(hitTest)
      moduleId = module.id
      break
    }
  }

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
    module: {rotation},
    moduleOrigin,
    // id,
  } = this._resizingOperator!
  const {cx, cy, width, height} = moduleOrigin
  // const module = this.moduleMap.get(id)

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
  // module.x = r.x
  // module.y = r.y
  // module.width = r.width
  // module.height = r.height

  return r
}

export function applyRotating(this: Editor, shiftKey: boolean) {
  const {mouseDownPoint, mouseMovePoint, scale, dpr} = this.viewport
  const {module: {rotation}, moduleOrigin} = this._rotatingOperator as RotateHandler
  const {cx, cy} = moduleOrigin
  // const module = this.moduleMap.get(id)

  const downX = (mouseDownPoint.x - this.viewport.offset.x / dpr) / scale * dpr
  const downY = (mouseDownPoint.y - this.viewport.offset.y / dpr) / scale * dpr
  const moveX = (mouseMovePoint.x - this.viewport.offset.x / dpr) / scale * dpr
  const moveY = (mouseMovePoint.y - this.viewport.offset.y / dpr) / scale * dpr

  const startAngle = Math.atan2(downY - cy, downX - cx)
  const currentAngle = Math.atan2(moveY - cy, moveX - cx)

  let rotationDelta = (currentAngle - startAngle) * (180 / Math.PI)

  if (shiftKey) {
    rotationDelta = Math.round(rotationDelta / 15) * 15
  }

  // Normalize rotation to [0, 360)
  let newRotation = (rotation + rotationDelta) % 360
  if (newRotation < 0) newRotation += 360

  // module.rotation = newRotation

  return newRotation
}