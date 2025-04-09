import {fitRectToViewport} from './viewport/helper.ts'
import resetCanvas from './viewport/resetCanvas.tsx'
import {SelectionModifyData, SelectionMoveData} from './actions/type'
import Editor from './editor.ts'
import {redo} from './history/redo.ts'
import {undo} from './history/undo.ts'
import {pick} from './history/pick.ts'

export function initEditor(this: Editor) {
  const {container, viewport, action} = this

  // const shadow = container.attachShadow({mode: 'open'})
  container.appendChild(viewport.wrapper)

  viewport.resizeObserver.observe(container)

  action.on('viewport-resize', () => {
    this.updateViewport()

    if (!this.viewport.initialized) {
      const {frame, viewportRect} = this.viewport
      const {scale, offsetX, offsetY} = fitRectToViewport(frame, viewportRect)

      this.viewport.scale = scale
      this.viewport.offset.x = offsetX
      this.viewport.offset.y = offsetY
      this.viewport.initialized = true
    }

    this.updateWorldRect()
    this.action.dispatch({type: 'world-update'})
  })

  this.action.on('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(this.viewport.mouseMovePoint.x, this.viewport.mouseMovePoint.y)
    this.events.onWorldMouseMove?.(p as Point)
  })

  this.action.on('world-update', () => {
    this.updateWorldRect()
    this.updateVisibleModuleMap()
    this.events.onViewportUpdated?.(this.viewport.worldRect as BoundingRect)
    this.action.dispatch({type: 'visible-module-update', data: this.getVisibleModuleMap()})
  })

  this.action.on('world-zoom', (data) => {
    console.log(data)
    const {
      zoomFactor,
      physicalPoint,
    } = data
    const {scale, offset} = this.zoomAtPoint(physicalPoint, zoomFactor)

    this.viewport.scale = scale
    this.viewport.offset.x = offset.x
    this.viewport.offset.y = offset.y
    this.action.dispatch({type: 'world-update'})
    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  this.action.on('world-shift', (data) => {
    const {x, y} = data as Point
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    this.action.dispatch({type: 'world-update'})

    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  this.action.on('visible-module-update', () => {
    this.dispatchVisibleSelectedModules()
    resetCanvas(this.viewport.mainCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
    this.renderModules()
  })

  this.action.on('visible-selected-update', (data) => {
    resetCanvas(this.viewport.selectionCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
    this.renderSelections(data.idSet as Set<UID>)
  })

  this.action.on('select-all', () => {
    this.selectedModules.clear()
    this.isSelectAll = true
    this.dispatchVisibleSelectedModules()
    // this.events.onSelectionUpdated?.('all', null)
  })

  this.action.on('selection-clear', () => {

    this.selectedModules.clear()
    this.isSelectAll = false
    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})
  })

  this.action.on('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.modifySelection(idSet, mode)
    this.dispatchVisibleSelectedModules()
  })

  this.action.on('selection-delete', () => {
    const backup = this.batchDelete(this.isSelectAll ? 'all' : this.selectedModules)
    this.selectedModules.clear()
    this.isSelectAll = false
    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})

    this.history.add({
      type: 'history-delete',
      payload: {
        modules: backup,
        selectedModules: this.getSelected(),
      },
    })
  })

  this.action.on('selection-copy', () => {
    this.copiedItems = this.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsDelta()
  })

  this.action.on('selection-paste', () => {
    if (this.copiedItems.length === 0) return

    const newModules = this.batchCreate(this.copiedItems)
    this.batchAdd(newModules)
    this.replace(new Set(newModules.keys()))
    this.updateCopiedItemsDelta()

    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})
  })

  this.action.on('selection-duplicate', () => {
    let temp: ModuleProps[]

    if (this.isSelectAll) {
      temp = this.batchCopy('all', true)
    } else {
      temp = this.batchCopy(this.selectedModules, true)
    }

    temp.forEach(copiedItem => {
      copiedItem!.x += this.CopyDeltaX
      copiedItem!.y += this.CopyDeltaY
    })

    const newModules = this.batchCreate(temp)
    this.batchAdd(newModules)
    this.isSelectAll = false
    this.replace(new Set(newModules.keys()))

    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})

    const moduleProps = [...newModules.values()].map(mod => mod.getDetails())
    // this.getSelected()

    this.history.add({
        type: 'history-add',
        payload: {
          modules: moduleProps,
          selectedModules: this.getSelected(),
        },
      },
    )
  })

  this.action.on('selection-move', ({direction, delta = {x: 0, y: 0}}: SelectionMoveData) => {
    if (!this.isSelectAll && this.selectedModules.size === 0) return

    const MODULE_MOVE_STEP = 5
    console.log(direction, delta)

    let backup: 'all' | Set<UID>

    switch (direction) {
      case 'module-move-down':
        delta.y = MODULE_MOVE_STEP
        break
      case 'module-move-up':
        delta.y = -MODULE_MOVE_STEP
        break
      case 'module-move-left':
        delta.x = -MODULE_MOVE_STEP
        break
      case 'module-move-right':
        delta.x = MODULE_MOVE_STEP
        break
    }

    if (this.isSelectAll) {
      this.batchMove('all', delta)
      backup = 'all'
    } else {
      backup = new Set(this.selectedModules)
      this.batchMove(this.selectedModules, delta)
    }

    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})

    this.history.add({
      type: 'history-move',
      payload: {
        delta,
        selectedModules: backup,
      },
    })
  })

  this.action.on('history-undo', () => {
    undo.call(this, true)
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})
    this.events.onHistoryUpdated?.(this.history)
  })

  this.action.on('history-redo', () => {
    redo.call(this, true)
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})
    this.events.onHistoryUpdated?.(this.history)
  })

  this.action.on('history-pick', (data) => {
    pick.call(this, data)
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})
    this.events.onHistoryUpdated?.(this.history)
  })

  this.action.on('context-menu', ({idSet,position}) => {
    this.events.onContextMenu?.(idSet,position)
  })
}
