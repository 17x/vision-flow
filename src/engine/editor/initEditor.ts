import resetCanvas from './viewport/resetCanvas.tsx'
import {SelectionModifyData} from './actions/type'
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

  container.appendChild(viewport.wrapper)

  viewport.resizeObserver.observe(container)

  on('world-resized', () => {
    this.updateViewport()

    if (!this.initialized) {
      this.initialized = true
      this.fitFrame()
      this.events.onInitialized?.()
    }

    dispatch('world-updated')
  })

  on('world-updated', () => {
    this.updateWorldRect()
    this.events.onViewportUpdated?.(this.viewport.worldRect as BoundingRect)
    dispatch('visible-module-updated')
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
  })

  on('world-shift', (data) => {
    const {x, y} = data
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    dispatch('world-updated')
  })

  on('visible-module-updated', () => {
    this.updateVisibleModuleMap()
    dispatch('render-modules')
    dispatch('visible-selection-updated')
  })

  on('visible-selection-updated', () => {
    this.updateVisibleSelected()
    dispatch('render-selection')
  })

  on('selection-all', () => {
    this.selectAll()
    dispatch('selection-updated')
  })

  on('selection-clear', () => {
    this.selectedModules.clear()
    dispatch('selection-updated')
  })

  on('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.modifySelected(idSet, mode)
    dispatch('selection-updated')
  })

  on('module-updated', (historyData: HistoryOperation) => {
    dispatch('visible-module-updated')
    dispatch('selection-updated')

    if (historyData) {
      this.history.add(historyData)
      this.events.onHistoryUpdated?.(this.history)
    }
  })

  on('selection-updated', () => {
    this.hoveredModule = null

    updateSelectionCanvasRenderData.call(this)
    this.events.onSelectionUpdated?.(this.selectedModules, this.getSelectedPropsIfUnique)

    dispatch('visible-selection-updated')
  })

  on('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(
      this.viewport.mouseMovePoint.x,
      this.viewport.mouseMovePoint.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
  })

  on('module-delete', () => {
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

    dispatch('module-updated', {
      type: 'history-paste',
      payload: {
        modules: [...newModules.values()].map((mod) => mod.getDetails()),
        selectedModules: savedSelected,
      },
    })
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

    dispatch('module-updated', {
      type: 'history-duplicate',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })
  })

  on('module-move', ({direction, delta = {x: 0, y: 0}}) => {
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

  on('module-add', (data) => {
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

  on('module-operating', () => {
    dispatch('module-updated')
  })

  on('module-modify', (data) => {
    dispatch('module-updated', {
      type: 'history-modify',
      payload: {
        selectedModules: this.getSelected,
        changes: [data],
      },
    })
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
    resetCanvas(
      this.viewport.selectionCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    this.renderSelections()
  })

  on('module-hover-enter', (id) => {
    this.hoveredModule = id
    dispatch('visible-selection-updated')
  })

  on('module-hover-leave', () => {
    this.hoveredModule = null
    dispatch('visible-selection-updated')
  })

  on('history-undo', () => {
    undo.call(this)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-redo', () => {
    redo.call(this)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('history-pick', (data) => {
    pick.call(this, data)
    dispatch('module-updated')
    this.events.onHistoryUpdated?.(this.history)
  })

  on('context-menu', ({idSet, position, copiedItems}) => {
    this.events.onContextMenu?.(idSet, position, copiedItems)
  })
}
