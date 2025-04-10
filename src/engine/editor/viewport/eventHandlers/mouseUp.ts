import {updateSelectionBox} from '../domManipulations.ts'
import Editor from '../../editor.ts'
import {applyResize} from './funcs.ts'
import {applyResizeTransform} from '../../../lib/lib.ts'
import {ModuleChangeProps, ModuleModifyData} from '../../actions/type'

function handleMouseUp(this: Editor, e: MouseEvent) {
  const {
    draggingModules,
    manipulationStatus,
    moduleMap,
    _selectingModules,
    _resizingOperator,
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
      // this.viewport.translateViewport(e.movementX, e.movementY)

      break

    case 'dragging': {
      const x =
        ((viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) *
          viewport.dpr) /
        viewport.scale
      const y =
        ((viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) *
          viewport.dpr) /
        viewport.scale
      const moved = !(x === 0 && y === 0)

      // mouse stay static
      if (moved) {
        // move back to origin position and do the move again
        draggingModules.forEach((id) => {
          moduleMap.get(id).x -= x
          moduleMap.get(id).y -= y
        })

        this.action.dispatch('selection-move', {
          direction: 'module-move-shift',
          delta: {x, y},
        })
      } else {
        const closestId = this.hoveredModule

        if (closestId && modifyKey && closestId === this._deselection) {
          this.action.dispatch('modify-selection', {
            mode: 'toggle',
            idSet: new Set([closestId]),
          })
        }
      }
    }
      break

    case 'resizing': {
      const {altKey, shiftKey} = e
      const {mouseDownPoint, mouseMovePoint, scale, dpr} = this.viewport
      const {name: handleName, data: {rotation}, moduleOrigin, id} = this._resizingOperator!
      const {cx, cy, width, height} = moduleOrigin
      const from: Rect = {
        x: cx,
        y: cy,
        width,
        height,
      }
      const to = applyResizeTransform({
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

      const props: ModuleChangeProps = {} // explicitly typed
/*
      for (const key in from) {
        const tkey = key as keyof ModuleModifyData
        const tvalue = from[key] as ModuleModifyData
        props[key] = {
          from: from[tkey],
          to: to[tkey],
        }
      }*/
      /*
      for (const key of Object.keys(r) as (keyof ModuleProps)[]) {
        props[key] = {
          from: from[key],
          to: r[key],
        }
      }*/
/*
      this.action.dispatch('module-modify', {
        id,
        props,
      })*/
    }
      break

    case 'rotating':
      break

    case 'mousedown':
      console.log(this.draggingModules)
      this.action.dispatch('selection-clear')
      break
    case 'static':
      // console.log(this.hoveredModules)
      /*console.log(this.handlingModules)
      if (this.hoveredModules.size === 0) {
        this.action.dispatch({
          type: 'selection-clear',
          data: null,
        })
      }*/
      // console.log()
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

export default handleMouseUp
