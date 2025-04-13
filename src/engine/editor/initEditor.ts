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
  const onAction = action.on.bind(action)
  const onEvent = action.on.bind(action)

  container.appendChild(viewport.wrapper)

  viewport.resizeObserver.observe(container)

  const forwardEventDependencyMap: Record<EditorEventType, EditorEventType[]> = {
    'world-resized': ['editor-initialized'],
    'editor-initialized': ['world-updated'],
    'world-updated': ['visible-module-updated'],
    'world-zoom': ['world-updated'],
    'world-shift': ['world-updated'],
    /* selections */
    'selection-all': ['selection-updated'],
    'selection-clear': ['selection-updated'],
    'selection-modify': ['selection-updated'],
    'selection-updated': ['visible-selection-updated'],
    'visible-selection-updated': ['render-selection'],
    'render-selection': [],
    'module-hover-enter': ['visible-selection-updated'],
    'module-hover-leave': ['visible-selection-updated'],
    /* modules */
    'module-add': ['module-updated'],
    'module-delete': ['module-updated'],
    'module-move': ['module-updated'],
    'module-paste': ['module-updated'],
    'module-duplicate': ['module-updated'],
    'module-operating': ['module-updated'],
    'module-modify': ['module-updated'],
    'module-updated': ['visible-module-updated', 'selection-updated'],
    'visible-module-updated': ['render-modules', 'visible-selection-updated'],
    'render-modules': [],
    /* history */
    'history-undo': ['module-updated'],
    'history-redo': ['module-updated'],
    'history-pick': ['module-updated'],
  }

  onEvent('world-resized', () => {
    this.updateViewport()

    if (this.initialized) {
      dispatch('world-updated')
    } else {
      dispatch('editor-initialized')
    }
  })

  onEvent('editor-initialized', () => {
    dispatch('world-updated')

    this.initialized = true
    this.fitFrame()
    this.events.onInitialized?.()
  })

  onAction('module-updated', (historyData: HistoryOperation) => {
    this.updateVisibleModuleMap()
    dispatch('render-modules')

    this.history.add(historyData)
  })

  onAction('selection-updated', () => {
    this.hoveredModule = null

    updateSelectionCanvasRenderData.call(this)
    this.events.onSelectionUpdated?.(this.selectedModules, this.getSelectedPropsIfUnique)

    dispatch('render-selection')
  })

  onEvent('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(
      this.viewport.mouseMovePoint.x,
      this.viewport.mouseMovePoint.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
  })

  onEvent('world-updated', () => {
    this.updateWorldRect()
    this.updateVisibleModuleMap()
    this.events.onViewportUpdated?.(this.viewport.worldRect as BoundingRect)
    dispatch('render-modules')
  })

  onAction('world-zoom', (arg) => {
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
  })

  onAction('world-shift', (data) => {
    const {x, y} = data
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    dispatch('world-updated')
  })

  onAction('selection-all', () => {
    this.selectAll()
    dispatch('selection-updated')
  })

  onAction('selection-clear', () => {
    this.selectedModules.clear()
    dispatch('selection-updated')
  })

  onAction('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.modifySelected(idSet, mode)
    dispatch('selection-updated')
  })

  onAction('module-delete', () => {
    const savedSelected = this.getSelected
    const backup = this.batchDelete(savedSelected)

    this.selectedModules.clear()

    dispatch('module-updated', {
      type: 'history-delete',
      payload: {
        modules: backup,
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-updated')
  })

  onAction('module-copy', () => {
    this.copiedItems = this.batchCopy(this.getSelected, false)
    this.updateCopiedItemsDelta()
  })

  onAction('module-paste', (position?) => {
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

    dispatch('module-updated', {
      type: 'history-paste',
      payload: {
        modules: [...newModules.values()].map((mod) => mod.getDetails()),
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-updated')
  })

  onAction('module-duplicate', () => {
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

    dispatch('module-updated', {
      type: 'history-duplicate',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-updated')
  })

  onAction('module-move', ({direction, delta = {x: 0, y: 0}}) => {
    if (this.getSelected.size === 0) return

    const MODULE_MOVE_STEP = 5

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

    dispatch('selection-updated')
    dispatch('render-modules')

    this.history.add({
      type: 'history-move',
      payload: {
        delta,
        selectedModules: savedSelected,
      },
    })
  })

  onAction('module-add', (data) => {
    const newModules = this.batchAdd(this.batchCreate(data))
    const savedSelected = new Set(newModules.keys())

    this.batchAdd(newModules)
    this.replaceSelected(savedSelected)

    const moduleProps = [...newModules.values()].map((mod) => mod.getDetails())

    dispatch('module-updated', {
      type: 'history-add',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })

    dispatch('selection-updated')
  })

  onAction('module-operating', () => {
    dispatch('render-modules')
    dispatch('selection-updated')
  })

  onAction('module-modify', (data) => {
    console.warn(data)

    this.history.add({
      type: 'history-modify',
      payload: {
        selectedModules: this.getSelected,
        changes: [data],
      },
    })

    dispatch('render-modules')
    dispatch('selection-updated')
  })

  onAction('module-updated', (/*quite = false*/) => {
    updateSelectionCanvasRenderData.call(this)
    dispatch('render-selection')
  })

  onEvent('render-modules', () => {
    resetCanvas(
      this.viewport.mainCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    this.renderModules()
  })

  onEvent('render-selection', () => {
    resetCanvas(
      this.viewport.selectionCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    this.renderSelections()
  })

  onAction('module-hover-enter', (id) => {
    this.hoveredModule = id

    updateSelectionCanvasRenderData.call(this)
    dispatch('render-selection')
  })
  onAction('module-hover-leave', () => {
    this.hoveredModule = null

    updateSelectionCanvasRenderData.call(this)
    dispatch('render-selection')
  })

  onAction('history-undo', () => {
    undo.call(this)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  onAction('history-redo', () => {
    redo.call(this)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  onAction('history-pick', (data) => {
    pick.call(this, data)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  onAction('context-menu', ({idSet, position, copiedItems}) => {
    this.events.onContextMenu?.(idSet, position, copiedItems)
  })
}
