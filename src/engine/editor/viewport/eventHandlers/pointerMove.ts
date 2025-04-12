import {updateCursor, updateSelectionBox} from '../domManipulations.ts'
import {
  generateBoundingRectFromTwoPoints,
  rectInside,
} from '../../../core/utils.ts'
import Editor from '../../editor.ts'
import {areSetsEqual, worldToScreen, getSymmetricDifference} from '../../../lib/lib.ts'
import {applyResize, applyRotating, updateHoveredModule} from './funcs.ts'

export default function handlePointerMove(this: Editor, e: PointerEvent) {
  const {
    action,
    draggingModules,
    moduleMap,
    viewport,
    selectedShadow,
    _selectingModules,
  } = this
  viewport.mouseMovePoint.x = e.clientX - viewport.rect!.x
  viewport.mouseMovePoint.y = e.clientY - viewport.rect!.y
  viewport.drawCrossLine = false
  // hoveredModules.clear()

  action.dispatch('world-mouse-move')

  switch (this.manipulationStatus) {
    case 'selecting': {
      viewport.wrapper.setPointerCapture(e.pointerId)
      const rect = generateBoundingRectFromTwoPoints(
        viewport.mouseDownPoint,
        viewport.mouseMovePoint,
      )
      const pointA = this.getWorldPointByViewportPoint(rect.x, rect.y)
      const pointB = this.getWorldPointByViewportPoint(
        rect.right,
        rect.bottom,
      )
      const virtualSelectionRect: BoundingRect =
        generateBoundingRectFromTwoPoints(pointA, pointB)
      const _selecting: Set<UID> = new Set()
      const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey

      // TODO test again
      this.getVisibleModuleMap.forEach((module) => {
        if (module.type === 'rectangle') {
          const boundingRect = module.getBoundingRect() as BoundingRect

          if (rectInside(boundingRect, virtualSelectionRect)) {
            _selecting.add(module.id)
          }
        }
      })

      const selectingChanged = !areSetsEqual(_selectingModules, _selecting)

      updateSelectionBox(viewport.selectionBox, rect)

      /**
       * Simple logic
       * If with modifyKey
       *    original-selected Symmetric Difference selecting
       * else
       *    original-selected merge selecting
       */
      if (!selectingChanged) return

      this._selectingModules = _selecting

      const SD = getSymmetricDifference(selectedShadow, _selecting)

      if (modifyKey) {
        action.dispatch('modify-selection', {
          mode: 'replace',
          idSet: SD,
        })
      } else {
        if (_selecting.size === 0 && selectedShadow.size === 0) {
          return action.dispatch('selection-clear')
        }
        const newSet = new Set([...selectedShadow, ..._selecting])

        action.dispatch('modify-selection', {
          mode: 'replace',
          idSet: newSet,
        })
      }
    }
      break

    case 'panning':
      action.dispatch('world-shift',
        {
          x: e.movementX,
          y: e.movementY,
        })

      break

    case 'dragging': {
      viewport.wrapper.setPointerCapture(e.pointerId)
      const x = (e.movementX * viewport.dpr) / viewport.scale
      const y = (e.movementY * viewport.dpr) / viewport.scale

      draggingModules.forEach((id) => {
        moduleMap.get(id).move(x, y)
      })

      // force update
      this.action.dispatch('visible-module-update')
    }
      break

    case 'resizing': {
      viewport.wrapper.setPointerCapture(e.pointerId)
      const {altKey, shiftKey} = e

      applyResize.call(this, altKey, shiftKey)

      this.action.dispatch('module-operating')
      // this.action.dispatch('visible-module-update')
    }
      break

    case 'rotating': {
      viewport.wrapper.setPointerCapture(e.pointerId)
      const {shiftKey} = e
      const centerPoint = this.getViewPointByWorldPoint(this._rotatingOperator!.moduleOrigin.cx, this._rotatingOperator!.moduleOrigin.cy)

      applyRotating.call(this, shiftKey)
      updateCursor(viewport.wrapper, viewport.cursor, centerPoint, viewport.mouseMovePoint)

      this.action.dispatch('module-operating')
    }
      break

    case 'mousedown': {
      const MOVE_THROTTLE = 1
      const moved =
        Math.abs(viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) >
        MOVE_THROTTLE ||
        Math.abs(viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) >
        MOVE_THROTTLE

      if (moved) {
        if (draggingModules.size > 0) {
          this.manipulationStatus = 'dragging'
        } else {
          this.manipulationStatus = 'selecting'
        }
      }
    }
      break

    case 'static': {
      const r = updateHoveredModule.call(this)
      const {viewport} = this

      if (r) {
        if (r.type === 'rotate') {
          const centerPoint = this.getViewPointByWorldPoint(r.moduleOrigin.cx, r.moduleOrigin.cy)

          updateCursor(viewport.wrapper, viewport.cursor, centerPoint, viewport.mouseMovePoint)
        } else {
          viewport.wrapper.style.cursor = r.cursor
        }
      } else {
        updateCursor(viewport.wrapper, viewport.cursor, 'hide')

        // viewport.wrapper.style.cursor = 'default'
      }

      viewport.wrapper.releasePointerCapture(e.pointerId)
      viewport.drawCrossLine = viewport.drawCrossLineDefault
    }

      break
  }
}
