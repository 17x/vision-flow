import Editor from '@editor/engine/editor.ts'
import {generateBoundingRectFromTwoPoints} from '@editor/core/utils.ts'
import {areSetsEqual, getSymmetricDifference} from '@editor/lib/lib.ts'
import {updateCursor, updateSelectionBox} from '@editor/engine/viewport/domManipulations.ts'
import Base from '@editor/core/modules/base.ts'
import {Tool} from '@editor/engine/tools/tool.ts'
import {
  applyResize,
  detectHoveredModule,
  getResizeCursor,
  getRotateAngle,
} from '@editor/engine/viewport/eventHandlers/funcs.ts'
import {BoundingRect} from '@editor/type.ts'
import {ModuleModifyData} from '@editor/engine/actions/type'

const selection: Tool = {
  start(this: Editor, e: MouseEvent) {
    const {shiftKey, metaKey, ctrlKey} = e
    const modifyKey = ctrlKey || metaKey || shiftKey

    const operator = detectHoveredModule.call(this)

    if (operator) {
      if (operator.type === 'resize') {
        this._resizingOperator = operator
        return (this.manipulationStatus = 'resizing')
      } else if (operator.type === 'rotate') {
        this._rotatingOperator = operator
        return (this.manipulationStatus = 'rotating')
      }
    }

    const hoveredModule = this.hoveredModule
    // console.log(hoveredModule)
    // Click on blank area and not doing multi-selection
    if (!hoveredModule) {
      // Determine clear selected modules
      if (!modifyKey) {
        this.action.dispatch('selection-clear')
      }
      this.selectedShadow = this.getSelected
      // console.warn(this.selectedShadow)
      return (this.manipulationStatus = 'selecting')
    }

    this.manipulationStatus = 'dragging'
    const realSelected = this.getSelected

    // this.draggingModules = new Set(this.selectedModules)
    const isSelected = realSelected.has(hoveredModule)
    // console.log(isSelected)
    if (realSelected.size === 0 || (!isSelected && !modifyKey)) {
      // Initial selection or replace selection without modifier key
      this.action.dispatch('selection-modify', {
        mode: 'replace',
        idSet: new Set([hoveredModule]),
      })
      this.draggingModules = new Set([hoveredModule])
    } else if (modifyKey) {
      this.draggingModules = new Set(realSelected)

      if (isSelected) {
        console.log('isSelected', isSelected)
        this._deselection = hoveredModule
        this.draggingModules.add(hoveredModule)
      } else {
        // Add to existing selection
        this.action.dispatch('selection-modify', {
          mode: 'add',
          idSet: new Set([hoveredModule]),
        })
      }
      this.draggingModules.add(hoveredModule)
    } else {
      // Dragging already selected module(s)
      this.draggingModules = new Set(realSelected)
    }
  },
  move(this: Editor, e: PointerEvent) {
    const {
      action,
      draggingModules,
      viewport,
      selectedShadow,
      _selectingModules,
    } = this

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

        this.moduleMap.forEach((module) => {
          if (module.isInsideRect(virtualSelectionRect)) {
            _selecting.add(module.id)
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
          action.dispatch('selection-modify', {
            mode: 'replace',
            idSet: SD,
          })
        } else {
          if (_selecting.size === 0 && selectedShadow.size === 0) {
            return action.dispatch('selection-clear')
          }
          const newSet = new Set([...selectedShadow, ..._selecting])

          action.dispatch('selection-modify', {
            mode: 'replace',
            idSet: newSet,
          })
        }
      }
        break

      case 'panning':
        viewport.wrapper.setPointerCapture(e.pointerId)
        updateCursor.call(this, 'grabbing')
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

        // force update
        this.action.dispatch('module-modifying', {
          type: 'move',
          data: {x, y},
        })
      }
        break

      case 'resizing': {
        viewport.wrapper.setPointerCapture(e.pointerId)
        const {altKey, shiftKey} = e
        // const {x, y} = this._rotatingOperator!.moduleOrigin
        // const centerPoint = this.getViewPointByWorldPoint(x, y)
        // const cursorDirection = getResizeDirection(centerPoint, viewport.mouseMovePoint)

        const r = applyResize.call(this, altKey, shiftKey)
        // console.log(r)
        this.action.dispatch('module-modifying', {
          type: 'resize',
          data: r,
        })
      }
        break

      case 'rotating': {
        viewport.wrapper.setPointerCapture(e.pointerId)
        const {shiftKey} = e
        const {x, y} = this._rotatingOperator!.moduleOrigin
        const centerPoint = this.getViewPointByWorldPoint(x, y)
        const rotation = Base.applyRotating.call(this, shiftKey)
        const cursorAngle = getRotateAngle(centerPoint, viewport.mouseMovePoint)

        updateCursor.call(this, 'rotate', viewport.mouseMovePoint, cursorAngle)

        this.action.dispatch('module-modifying', {
          type: 'rotate',
          data: {rotation},
        })
      }
        break

      case 'waiting': {
        console.log('mousedown')
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
        const r = detectHoveredModule.call(this)
        const {viewport} = this

        if (r) {
          if (r.type === 'rotate') {
            const centerPoint = this.getViewPointByWorldPoint(r.moduleOrigin.x, r.moduleOrigin.y)
            const angle = getRotateAngle(centerPoint, viewport.mouseMovePoint)

            updateCursor.call(this, 'rotate', viewport.mouseMovePoint, angle)
          } else if (r.type === 'resize') {
            const {x, y} = r.moduleOrigin
            const centerPoint = this.getViewPointByWorldPoint(x, y)
            const cursorDirection = getResizeCursor(viewport.mouseMovePoint, centerPoint)

            updateCursor.call(this, 'resize', cursorDirection)
          }
        } else {
          updateCursor.call(this, 'default')
        }

        viewport.wrapper.releasePointerCapture(e.pointerId)
        viewport.drawCrossLine = viewport.drawCrossLineDefault
      }

        break
    }
  },
  finish(this: Editor, e: MouseEvent) {
    const leftMouseClick = e.button === 0

    if (leftMouseClick) {
      const {
        draggingModules,
        manipulationStatus,
        moduleMap,
        _selectingModules,
        selectedShadow,
        viewport,
      } = this
      const x = e.clientX - viewport.rect!.x
      const y = e.clientY - viewport.rect!.y
      const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey
      // console.log('up',manipulationStatus)
      viewport.mouseMovePoint.x = x
      viewport.mouseMovePoint.y = y

      switch (manipulationStatus) {
        case 'selecting':
          break

        case 'panning':
          updateCursor.call(this, 'grabbing')
          // this.viewport.translateViewport(e.movementX, e.movementY)

          break

        case 'dragging': {
          const x = ((viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) *
              viewport.dpr) /
            viewport.scale
          const y = ((viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) *
              viewport.dpr) /
            viewport.scale
          const moved = !(x === 0 && y === 0)

          // mouse stay static
          if (moved) {
            const changes: ModuleModifyData[] = []
            this.action.dispatch('module-modifying', {
              type: 'move',
              data: {x: -x, y: -y},
            })

            // Move back to origin position and do the move again
            draggingModules.forEach((id) => {
              const module = moduleMap.get(id)

              if (module) {
                const change: ModuleModifyData = {
                  id,
                  props: {
                    x: module.x + x,
                    y: module.y + y,
                  },
                }

                changes.push(change)
              }
            })

            this.action.dispatch('module-modify', changes)
          } else {
            const closestId = this.hoveredModule

            if (closestId && modifyKey && closestId === this._deselection) {
              this.action.dispatch('selection-modify', {
                mode: 'toggle',
                idSet: new Set([closestId]),
              })
            }
          }
        }
          break

        case 'resizing': {
          const {altKey, shiftKey} = e
          const props = applyResize.call(this, altKey, shiftKey)
          const moduleOrigin = this._resizingOperator?.moduleOrigin
          const rollbackProps: Partial<ModuleProps> = {}

          Object.keys(props).forEach((key) => {
            rollbackProps[key] = moduleOrigin[key]
          })

          // rotate back
          this.action.dispatch('module-modifying', {
            type: 'resize',
            data: rollbackProps,
          })

          this.action.dispatch('module-modify', [{
            id: this._resizingOperator!.id,
            props,
          }])
        }
          break

        case 'rotating': {
          const {shiftKey} = e
          const newRotation = Base.applyRotating.call(this, shiftKey)
          const {rotation} = this._rotatingOperator?.moduleOrigin!
          const rollbackProps: Partial<ModuleProps> = {rotation}

          // rotate back
          this.action.dispatch('module-modifying', {
            type: 'resize',
            data: rollbackProps,
          })

          this.action.dispatch('module-modify', [{
            id: this._rotatingOperator!.id,
            props: {rotation: newRotation},
          }])
        }
          break

        case 'waiting':
          this.action.dispatch('selection-clear')
          break
        case 'static':
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            this.toggleSelected(draggingModules)
          } else {
            this.replaceSelected(draggingModules)
          }

          break
      }

      draggingModules.clear()
      selectedShadow.clear()
      _selectingModules.clear()
      _selectingModules.clear()
      this.manipulationStatus = 'static'
      this._deselection = null
      this._resizingOperator = null

      updateSelectionBox(
        viewport.selectionBox,
        {x: 0, y: 0, width: 0, height: 0},
        false,
      )
    }

  },
}

export default selection