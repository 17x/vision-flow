import Editor from '../../editor.ts'
import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {ModuleType} from 'i18next'
import {ResizeDirection} from '../../selection/type'

export function detectHoveredModule(this: Editor) {
  const {viewport} = this
  const worldPoint = this.getWorldPointByViewportPoint(
    viewport.mouseMovePoint.x,
    viewport.mouseMovePoint.y,
  )
  // const maxLayer = Number.MIN_SAFE_INTEGER
  let moduleId: UID | null = null
  let hitOn = null
  const arr = [...this.operationHandlers]
  // const len = arr.length
  console.log(arr)
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].module.hitTest(worldPoint)) {
      hitOn = arr[i]
      break
    }
  }
  /*
    const operationHandlers = [...this.operationHandlers].filter(
      (operationHandler) => {
        return operationHandler.module.hitTest(worldPoint)
      },
    )
  */

  // const operator = operationHandlers[operationHandlers.length - 1]
  console.log(hitOn)
  if (hitOn) {
    // console.log(operator)
    this.action.dispatch('module-hover-enter', hitOn.id)
    return hitOn
  }

  const arr2 = [...this.getVisibleModuleMap.values()]

  for (let i = arr2.length - 1; i >= 0; i--) {
    const module = arr2[i]
    const hitTest = module.hitTest(worldPoint)
    if (hitTest) {
      // console.log(hitTest)
      moduleId = module.id
      break
    }
  }

  /*  if (this.hoveredModule !== moduleId) {
      if (this.hoveredModule) {
        this.action.dispatch('module-hover-leave', this.hoveredModule)
      }

      if (moduleId) {
        this.action.dispatch('module-hover-enter', moduleId)
      }
    }*/
}

export function applyResize(this: Editor, altKey: boolean, shiftKey: boolean) {
  const {mouseDownPoint, mouseMovePoint, scale, dpr} = this.viewport
  const {
    name: handleName,
    module: {rotation},
    moduleOrigin,
  } = this._resizingOperator!
  const {id} = moduleOrigin
  const resizeParam = {
    downPoint: mouseDownPoint,
    movePoint: mouseMovePoint,
    dpr,
    scale,
    rotation,
    handleName,
    altKey,
    shiftKey,
    moduleOrigin,
  }

  const relatedModule = this.moduleMap.get(id)

  if (relatedModule) {
    const con = relatedModule.constructor as ModuleInstance
    console.log(resizeParam)
    return con.applyResizeTransform(resizeParam)
  }/*
  if (type === 'rectangle') {
    return Rectangle.applyResizeTransform(resizeParam)
  }*/
}

export function getRotateAngle(centerPoint: Point, mousePoint: Point) {
  const dx = mousePoint!.x - centerPoint.x
  const dy = mousePoint!.y - centerPoint.y
  const angleRad = Math.atan2(dy, dx)
  const angleDeg = angleRad * (180 / Math.PI)
  let normalizedAngle = angleDeg
  if (normalizedAngle < 0) normalizedAngle += 360
  return normalizedAngle
}

export function getResizeDirection(point: Point, center: Point): ResizeDirection {
  const dx = point.x - center.x
  const dy = point.y - center.y

  const horizontal = dx > 0 ? 'e' : 'w'
  const vertical = dy > 0 ? 's' : 'n'

  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  if (absDx > absDy) {
    return horizontal as ResizeDirection
  } else if (absDy > absDx) {
    return vertical as ResizeDirection
  } else {
    // Diagonal case
    return (vertical + horizontal) as ResizeDirection
  }
}