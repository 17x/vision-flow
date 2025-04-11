import {updateSelectionBox} from '../domManipulations.ts'
// import Rectangle from '../../../core/modules/shapes/rectangle.ts'
import {
  generateBoundingRectFromTwoPoints, isInsideRotatedRect,
  rectInside,
} from '../../../core/utils.ts'
import Editor from '../../editor.ts'
import {areSetsEqual, getResizeTransform, getSymmetricDifference} from '../../../lib/lib.ts'
import {updateHoveredModule} from './funcs.ts'
import {ResizeHandler} from '../../selection/type'

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
      const {originCursor, data, id} = this._resizingOperator!

      // const t = getResizeTransform(originCursor)
      const module = moduleMap.get(id)
      const {width, height} = module
      const adjustedMovementX = e.movementX / this.viewport.scale * this.viewport.dpr
      const adjustedMovementY = e.movementY / this.viewport.scale * this.viewport.dpr

      // Inverse rotation (to rotate deltas into element's local space)
      const angle = -data.rotation * (Math.PI / 180)
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)

      // Local deltas relative to module's rotation
      const localDX = adjustedMovementX * cos + adjustedMovementY * sin
      const localDY = -adjustedMovementX * sin + adjustedMovementY * cos

      const t = getResizeTransform(originCursor) // dx, dy, cx, cy

      // Movement along resize axis
      let dx = localDX * t.dx
      let dy = localDY * t.dy

      // --- SHIFT: Keep aspect ratio ---
      if (e.shiftKey) {
        const aspect = width / height || 1

        if (Math.abs(dx) > Math.abs(dy)) {
          dy = dx / aspect
        } else {
          dx = dy * aspect
        }
      }

      // --- ALT: Scale from center (mirror the resize) ---
      const factor = e.altKey ? 2 : 1 // resize from both sides when Alt held


      module.width += dx * factor
      module.height += dy * factor
      module.x -= dx * t.cx * factor
      module.y -= dy * t.cy * factor
      console.log(originCursor)
      this.action.dispatch('visible-module-update')
    }
      break

    case 'rotating':
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
        viewport.wrapper.style.cursor = r.cursor
      } else {
        viewport.wrapper.style.cursor = 'default'
      }

      viewport.wrapper.releasePointerCapture(e.pointerId)
      viewport.drawCrossLine = viewport.drawCrossLineDefault
    }

      break
  }
}
