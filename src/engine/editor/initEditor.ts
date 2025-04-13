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

  onEvent('world-resized', () => {
    this.updateViewport()

    if (!this.initialized) {
      this.initialized = true
      this.fitFrame()
      this.events.onInitialized?.()
    }

    dispatch('world-updated')
  })

  onEvent('world-updated', () => {
    this.updateWorldRect()
    this.events.onViewportUpdated?.(this.viewport.worldRect as BoundingRect)
    dispatch('visible-module-updated')
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

  onAction('visible-module-updated', () => {
    this.updateVisibleModuleMap()
    dispatch('render-modules')
    dispatch('visible-selection-updated')
  })

  onAction('visible-selection-updated', () => {
    // updateSelectionCanvasRenderData()
    this.updateVisibleSelected()
    dispatch('render-selection')
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

  onAction('module-updated', (historyData: HistoryOperation) => {
    dispatch('visible-module-updated')
    dispatch('selection-updated')

    if (historyData) {
      this.history.add(historyData)
      this.events.onHistoryUpdated?.(this.history)
    }
  })

  onAction('selection-updated', () => {
    this.hoveredModule = null

    updateSelectionCanvasRenderData.call(this)
    this.events.onSelectionUpdated?.(this.selectedModules, this.getSelectedPropsIfUnique)

    dispatch('visible-selection-updated')
  })

  onEvent('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(
      this.viewport.mouseMovePoint.x,
      this.viewport.mouseMovePoint.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
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

    dispatch('module-updated', {
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
  })

  onAction('module-operating', () => {
    dispatch('module-updated')
  })

  onAction('module-modify', (data) => {
    dispatch('module-updated', {
      type: 'history-modify',
      payload: {
        selectedModules: this.getSelected,
        changes: [data],
      },
    })
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

    // updateSelectionCanvasRenderData.call(this)
    dispatch('visible-selection-updated')
  })
  onAction('module-hover-leave', () => {
    this.hoveredModule = null

    // updateSelectionCanvasRenderData.call(this)
    dispatch('visible-selection-updated')
  })

  onAction('history-undo', () => {
    undo.call(this)
    dispatch('module-updated')
    console.log(this.history)
    this.events.onHistoryUpdated?.(this.history)
  })

  onAction('history-redo', () => {
    redo.call(this)
    dispatch('module-updated')
    console.log(this.history)
    this.events.onHistoryUpdated?.(this.history)
  })

  onAction('history-pick', (data) => {
    pick.call(this, data)
    dispatch('module-updated')
    console.log(this.history)
    this.events.onHistoryUpdated?.(this.history)
  })

  onAction('context-menu', ({idSet, position, copiedItems}) => {
    this.events.onContextMenu?.(idSet, position, copiedItems)
  })
}
