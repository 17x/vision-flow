import Editor from '../../editor.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'

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
  const {x, y, type, width, height} = moduleOrigin
  const resizeParam = {
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
    initialCX: x,
    initialCY: y,
  }
  if (type === 'rectangle') {
    return Rectangle.applyResizeTransform(resizeParam)
  }
}