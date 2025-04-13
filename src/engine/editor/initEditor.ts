import resetCanvas from './viewport/resetCanvas.tsx'
import {EditorEventType, SelectionModifyData} from './actions/type'
import Editor from './editor.ts'
import {redo} from './history/redo.ts'
import {undo} from './history/undo.ts'
import {pick} from './history/pick.ts'
import {HistoryOperation} from './history/type'
import {updateSelectionCanvasRenderData} from './selection/helper.ts'

export function initEditor(this: Editor) {
  const {container, viewport, action} = this
  const dispatch = action.dispatch.bind(action)
  const on = action.on.bind(action)
  // const off = action.off.bind(action)

  container.appendChild(viewport.wrapper)

  viewport.resizeObserver.observe(container)

  const forwardEventDependencyMap: Record<EditorEventType, EditorEventType[]> = {
    'world-resized': ['world-updated', 'editor-initialized'],
    'editor-initialized': ['world-updated'],
    'module-map-updated': ['render-modules'],
    'world-updated': ['render-modules'],
    'world-zoom': ['world-updated'],
    'world-shift': ['world-updated'],
    'selection-all': ['selection-update'],
    'selection-update': ['render-selection'],
    'selection-clear': ['selection-update'],
    'selection-modify': ['selection-update'],
    'module-delete': ['module-map-updated', 'selection-update'],
    'module-paste': ['module-map-updated', 'selection-update'],
    'module-duplicate': ['module-map-updated', 'selection-update'],
    'module-move': ['selection-update', 'render-modules'],
    'module-add': ['module-map-updated', 'selection-update'],
    'module-operating': ['render-modules', 'selection-update'],
    'module-modify': ['render-modules', 'selection-update'],
    'render-modules': ['render-selection'],
    'module-hover-enter': ['render-selection'],
    'module-hover-leave': ['render-selection'],
    'history-undo': ['render-modules'],
    'history-redo': ['render-modules'],
    'history-pick': ['render-modules'],
  }

  on('world-resized', () => {
    this.updateViewport()
    // this.updateWorldRect()

    if (this.initialized) {
      dispatch('world-updated')
    } else {
      dispatch('editor-initialized')
    }
  })

  on('editor-initialized', () => {
    dispatch('world-updated')

    this.initialized = true
    this.fitFrame()
    this.events.onInitialized?.()
    // dispatch('editor-initialized')
  })

  on('module-map-updated', (historyData: HistoryOperation) => {
    // this.replaceSelected(historyData.payload.selectedModules)
    this.updateVisibleModuleMap()
    dispatch('render-modules', true)
    // dispatch('editor-selection-update')

    this.history.add(historyData)
  })

  on('selection-update', () => {
    this.hoveredModule = null

    updateSelectionCanvasRenderData.call(this)
    this.events.onSelectionUpdated?.(this.selectedModules, this.getSelectedPropsIfUnique)

    dispatch('render-selection')
  })

  on('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(
      this.viewport.mouseMovePoint.x,
      this.viewport.mouseMovePoint.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
  })

  on('world-updated', () => {
    this.updateWorldRect()
    this.updateVisibleModuleMap()
    this.events.onViewportUpdated?.(this.viewport.worldRect as BoundingRect)
    dispatch('render-modules')
    // console.log(this.getVisibleSelected, {...this.viewport})
  })

  on('world-zoom', (arg) => {
    if (arg === 'fit') {
      this.fitFrame()
      dispatch('world-updated')
    } else {
      const r = this.zoomAtPoint(arg.physicalPoint, arg.zoomFactor)

      if (r) {
        const {scale, offset} = r
        this.viewport.scale = scale
        this.viewport.offset.x = offset.x
        this.viewport.offset.y = offset.y
        dispatch('world-updated')
      }
    }
    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  on('world-shift', (data) => {
    const {x, y} = data
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    dispatch('world-updated')

    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  on('selection-all', () => {
    this.selectAll()
    dispatch('selection-update')
  })

  on('selection-clear', () => {
    this.selectedModules.clear()
    dispatch('selection-update')
  })

  on('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.modifySelected(idSet, mode)
    dispatch('selection-update')
  })

  on('module-delete', () => {
    const savedSelected = this.getSelected
    const backup = this.batchDelete(savedSelected)

    this.selectedModules.clear()

    dispatch('module-map-updated', {
      type: 'history-delete',
      payload: {
        modules: backup,
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-update')
  })

  on('module-copy', () => {
    this.copiedItems = this.batchCopy(this.getSelected, false)
    this.updateCopiedItemsDelta()
  })

  on('module-paste', (position?) => {
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

    dispatch('module-map-updated', {
      type: 'history-paste',
      payload: {
        modules: [...newModules.values()].map((mod) => mod.getDetails()),
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-update')
  })

  on('module-duplicate', () => {
    const temp: ModuleProps[] = this.batchCopy(this.selectedModules, false)

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

    dispatch('module-map-updated', {
      type: 'history-duplicate',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-update')
  })

  on('module-move', ({direction, delta = {x: 0, y: 0}}) => {
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

    dispatch('selection-update')
    dispatch('render-modules')
    // console.log(999)
    // this.events.onSelectionUpdated?.(this.selectedModules, this.getSelectedPropsIfUnique)

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

    dispatch('module-map-updated', {
      type: 'history-add',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-update')
  })

  on('module-operating', () => {
    dispatch('render-modules')
    dispatch('selection-update')
  })

  on('module-modify', (data) => {
    console.warn(data)

    this.history.add({
      type: 'history-modify',
      payload: {
        selectedModules: this.getSelected,
        changes: [data],
      },
    })

    dispatch('render-modules')
    dispatch('selection-update')
  })

  on('module-map-updated', (/*quite = false*/) => {
    /*if (!quite) {
      updateSelectionCanvasRenderData.call(this)
      dispatch('render-selection')
    }*/
    updateSelectionCanvasRenderData.call(this)
    dispatch('render-selection')
  })

  on('render-modules', () => {
    resetCanvas(
      this.viewport.mainCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    this.renderModules()
  })

  on('render-selection', () => {
    // console.log(this.getVisibleSelectedModules)

    // operators = this.operationHandlers,
    resetCanvas(
      this.viewport.selectionCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    // console.log(this.getVisibleSelected)
    this.renderSelections()
  })

  on('module-hover-enter', (id) => {
    this.hoveredModule = id

    updateSelectionCanvasRenderData.call(this)
    dispatch('render-selection')
  })
  on('module-hover-leave', () => {
    this.hoveredModule = null

    updateSelectionCanvasRenderData.call(this)
    dispatch('render-selection')
  })

  on('history-undo', () => {
    undo.call(this)
    // this.updateVisibleModuleMap()
    dispatch('module-map-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-redo', () => {
    redo.call(this)
    // this.updateVisibleModuleMap()
    dispatch('module-map-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-pick', (data) => {
    pick.call(this, data)
    // this.updateVisibleModuleMap()
    dispatch('module-map-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('context-menu', ({idSet, position, copiedItems}) => {
    this.events.onContextMenu?.(idSet, position, copiedItems)
  })
}
