import {updateCursor, updateSelectionBox} from '../domManipulations.ts'
import Editor from '../../editor.ts'
import {ModuleModifyData} from '../../actions/type'
import Base from '../../../core/modules/base.ts'
import {applyResize} from './funcs.ts'

function handleMouseUp(this: Editor, e: MouseEvent) {
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

}

export default handleMouseUp
