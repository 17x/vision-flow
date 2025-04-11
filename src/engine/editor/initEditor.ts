import resetCanvas from './viewport/resetCanvas.tsx'
import {SelectionModifyData} from './actions/type'
import Editor from './editor.ts'
import {redo} from './history/redo.ts'
import {undo} from './history/undo.ts'
import {pick} from './history/pick.ts'
import {HistoryOperation} from './history/type'
import {updateVisibleSelected} from './selection/helper.ts'

export function initEditor(this: Editor) {
  const {container, viewport, action} = this
  const dispatch = action.dispatch.bind(action)
  const on = action.on.bind(action)
  // const off = action.off.bind(action)

  container.appendChild(viewport.wrapper)

  viewport.resizeObserver.observe(container)

  on('viewport-resize', () => {
    this.updateViewport()
    // this.updateWorldRect()

    if (this.initialized) {
      dispatch('world-update')
    } else {
      dispatch('editor-initialized')
    }
  })

  on('editor-initialized', () => {
    dispatch('world-update')

    this.initialized = true
    this.fitFrame()
    this.events.onInitialized?.()
    // dispatch('editor-initialized')
  })

  on('editor-module-map-update', (historyData: HistoryOperation) => {
    // this.replaceSelected(historyData.payload.selectedModules)
    this.updateVisibleModuleMap()

    dispatch('visible-module-update', true)
    // dispatch('editor-selection-update')

    this.history.add(historyData)
  })

  on('editor-selection-update', () => {
    updateVisibleSelected.call(this)
    this.events.onSelectionUpdated?.(this.selectedModules, this.getSelectedPropsIfUnique())

    dispatch('visible-selected-update')
  })

  on('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(
      this.viewport.mouseMovePoint.x,
      this.viewport.mouseMovePoint.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
  })

  on('world-update', () => {
    this.updateWorldRect()
    this.updateVisibleModuleMap()
    this.events.onViewportUpdated?.(this.viewport.worldRect as BoundingRect)
    dispatch('visible-module-update')
    // console.log(this.getVisibleSelected, {...this.viewport})
  })

  on('world-zoom', (arg) => {
    if (arg === 'fit') {
      this.fitFrame()
      dispatch('world-update')
    } else {
      const r = this.zoomAtPoint(arg.physicalPoint, arg.zoomFactor)

      if (r) {
        const {scale, offset} = r
        this.viewport.scale = scale
        this.viewport.offset.x = offset.x
        this.viewport.offset.y = offset.y
        dispatch('world-update')
      }
    }
    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  on('world-shift', (data) => {
    const {x, y} = data
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    dispatch('world-update')

    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  on('select-all', () => {
    this.selectAll()
    dispatch('editor-selection-update')
  })

  on('selection-clear', () => {
    this.selectedModules.clear()
    dispatch('editor-selection-update')
  })

  on('modify-selection', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.modifySelected(idSet, mode)
    dispatch('editor-selection-update')
  })

  on('selection-delete', () => {
    const savedSelected = this.getSelected
    const backup = this.batchDelete(savedSelected)

    this.selectedModules.clear()

    dispatch('editor-module-map-update', {
      type: 'history-delete',
      payload: {
        modules: backup,
        selectedModules: savedSelected,
      },
    })

    dispatch('editor-selection-update')
  })

  on('selection-copy', () => {
    this.copiedItems = this.batchCopy(
      this.getSelected,
      true,
    )
    this.updateCopiedItemsDelta()
  })

  on('selection-paste', (position?) => {
    if (this.copiedItems.length === 0) return

    let newModules: ModuleMap

    if (position) {
      const {x, y} = this.getWorldPointByViewportPoint(position.x, position.y)
      const topLeftItem = this.copiedItems.reduce((prev, current) => {
        return (current.x < prev.x && current.y < prev.y) ? current : prev
      })
      const offsetX = x - topLeftItem.x
      const offsetY = y - topLeftItem.y

      const offsetItems = this.copiedItems.map((item) => {

        return {
          ...item,
          x: item.x + offsetX,
          y: item.y + offsetY,
        }
      })

      newModules = this.batchCreate(offsetItems)
    } else {
      newModules = this.batchCreate(this.copiedItems)
    }

    const savedSelected = new Set(newModules.keys())

    this.batchAdd(newModules)
    this.replaceSelected(savedSelected)
    this.updateCopiedItemsDelta()

    dispatch('editor-module-map-update', {
      type: 'history-paste',
      payload: {
        modules: [...newModules.values()].map((mod) => mod.getDetails()),
        selectedModules: savedSelected,
      },
    })

    dispatch('editor-selection-update')
  })

  on('selection-duplicate', () => {
    const temp: ModuleProps[] = this.batchCopy(this.selectedModules, true)

    temp.forEach((copiedItem) => {
      copiedItem!.x += this.CopyDeltaX
      copiedItem!.y += this.CopyDeltaY
    })

    const newModules = this.batchCreate(temp)
    const savedSelected = new Set(newModules.keys())

    this.batchAdd(newModules)
    this.replaceSelected(savedSelected)

    const moduleProps = [...newModules.values()].map((mod) => mod.getDetails())
    // this.getSelected()

    dispatch('editor-module-map-update', {
      type: 'history-duplicate',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })

    dispatch('editor-selection-update')
  })

  on('selection-move', ({direction, delta = {x: 0, y: 0}}) => {
    if (this.getSelected.size === 0) return

    const MODULE_MOVE_STEP = 5
    // console.log(direction, delta)

    const savedSelected: Set<UID> = this.getSelected

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

    this.batchMove(this.selectedModules, delta)

    // const savedSelected = this.getSelected

    dispatch('editor-selection-update')
    dispatch('visible-module-update')
    // console.log(999)
    // this.events.onSelectionUpdated?.(this.selectedModules, this.getSelectedPropsIfUnique())

    this.history.add({
      type: 'history-move',
      payload: {
        delta,
        selectedModules: savedSelected,
      },
    })
  })

  on('module-add', (data) => {
    const newModules = this.batchAdd(this.batchCreate(data))
    const savedSelected = new Set(newModules.keys())

    this.batchAdd(newModules)
    this.replaceSelected(savedSelected)

    const moduleProps = [...newModules.values()].map((mod) => mod.getDetails())

    dispatch('editor-module-map-update', {
      type: 'history-add',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })

    dispatch('editor-selection-update')
  })

  on('visible-module-update', (quite = false) => {
    if (!quite) {
      updateVisibleSelected.call(this)
      dispatch('visible-selected-update')
    }
    resetCanvas(
      this.viewport.mainCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    this.renderModules()
  })

  on('visible-selected-update', () => {
    // console.log(this.getVisibleSelectedModules)

    // operators = this.operationHandlers,
    resetCanvas(
      this.viewport.selectionCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    console.log(this.getVisibleSelected)
    this.renderSelections(this.getVisibleSelected)
  })

  on('history-undo', () => {
    undo.call(this)
    this.updateVisibleModuleMap()
    dispatch('visible-module-update')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-redo', () => {
    redo.call(this)
    this.updateVisibleModuleMap()
    dispatch('visible-module-update')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-pick', (data) => {
    pick.call(this, data)
    this.updateVisibleModuleMap()
    dispatch('visible-module-update')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('context-menu', ({idSet, position, copiedItems}) => {
    this.events.onContextMenu?.(idSet, position, copiedItems)
  })
}
