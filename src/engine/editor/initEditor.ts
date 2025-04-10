import resetCanvas from './viewport/resetCanvas.tsx'
import {SelectionModifyData} from './actions/type'
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
    this.updateWorldRect()

    if (!this.initialized) {
      this.initialized = true
      this.fitFrame()
    }

    this.action.dispatch('world-update')
  })

  this.action.on('world-mouse-move', () => {
    const p = this.getWorldPointByViewportPoint(
      this.viewport.mouseMovePoint.x,
      this.viewport.mouseMovePoint.y,
    )
    this.events.onWorldMouseMove?.(p as Point)
  })

  this.action.on('world-update', () => {
    this.updateWorldRect()
    this.updateVisibleModuleMap()
    this.events.onViewportUpdated?.(this.viewport.worldRect as BoundingRect)
    this.action.dispatch('visible-module-update')
  })

  this.action.on('world-zoom', (arg) => {
    if (arg === 'fit') {
      this.fitFrame()
      this.action.dispatch('world-update')
    } else {
      const r = this.zoomAtPoint(arg.physicalPoint, arg.zoomFactor)

      if (r) {
        const {scale, offset} = r
        this.viewport.scale = scale
        this.viewport.offset.x = offset.x
        this.viewport.offset.y = offset.y
        this.action.dispatch('world-update')
      }
    }

    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  this.action.on('world-shift', (data) => {
    const {x, y} = data
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    this.action.dispatch('world-update')

    // this.events.onViewportUpdated?.(worldRect as BoundingRect)
  })

  this.action.on('visible-module-update', () => {
    this.dispatchVisibleSelectedModules()
    resetCanvas(
      this.viewport.mainCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    this.renderModules()
  })

  this.action.on('visible-selected-update', (data) => {
    resetCanvas(
      this.viewport.selectionCTX,
      this.viewport.dpr,
      this.viewport.scale,
      this.viewport.offset,
    )
    this.renderSelections(data!.idSet as Set<UID>)
    // this.action.dispatch("visible-module-update")
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
    this.action.dispatch('visible-module-update')
  })

  this.action.on('selection-modify', (data) => {
    const {mode, idSet} = data as SelectionModifyData

    this.modifySelected(idSet, mode)
    this.dispatchVisibleSelectedModules()
  })

  this.action.on('selection-delete', () => {
    const backup = this.batchDelete(this.getSelected())
    const savedSelected = this.getSelectedIdSet()

    this.selectedModules.clear()
    this.isSelectAll = false
    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch('visible-module-update')

    console.log(savedSelected)
    this.history.add({
      type: 'history-delete',
      payload: {
        modules: backup,
        selectedModules: savedSelected,
      },
    })
  })

  this.action.on('selection-copy', () => {
    this.copiedItems = this.batchCopy(
      this.isSelectAll ? 'all' : this.selectedModules,
      true,
    )
    this.updateCopiedItemsDelta()
  })

  this.action.on('selection-paste', (position?) => {
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

    const idSet = new Set(newModules.keys())
    // const savedSelected = this.getSelectedIdSet()

    this.batchAdd(newModules)
    this.replaceSelected(idSet)
    this.updateCopiedItemsDelta()

    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch('visible-module-update')

    this.history.add({
      type: 'history-paste',
      payload: {
        modules: [...newModules.values()].map((mod) => mod.getDetails()),
        selectedModules: idSet,
      },
    })
  })

  this.action.on('selection-duplicate', () => {
    let temp: ModuleProps[]

    if (this.isSelectAll) {
      temp = this.batchCopy('all', true)
    } else {
      temp = this.batchCopy(this.selectedModules, true)
    }

    temp.forEach((copiedItem) => {
      copiedItem!.x += this.CopyDeltaX
      copiedItem!.y += this.CopyDeltaY
    })

    const newModules = this.batchCreate(temp)
    const savedSelected = new Set(newModules.keys())

    this.batchAdd(newModules)
    this.isSelectAll = false
    this.replaceSelected(new Set(newModules.keys()))

    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch('visible-module-update')

    const moduleProps = [...newModules.values()].map((mod) => mod.getDetails())
    // this.getSelected()

    this.history.add({
      type: 'history-duplicate',
      payload: {
        modules: moduleProps,
        selectedModules: savedSelected,
      },
    })
  })

  this.action.on(
    'selection-move',
    ({direction, delta = {x: 0, y: 0}}) => {
      if (!this.isSelectAll && this.selectedModules.size === 0) return

      const MODULE_MOVE_STEP = 5
      console.log(direction, delta)

      const savedSelected: Set<UID> = this.getSelectedIdSet()

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
      } else {
        this.batchMove(this.selectedModules, delta)
      }

      // const savedSelected = this.getSelectedIdSet()

      this.dispatchVisibleSelectedModules()
      this.updateVisibleModuleMap()
      this.action.dispatch('visible-module-update')

      this.history.add({
        type: 'history-move',
        payload: {
          delta,
          selectedModules: savedSelected,
        },
      })
    },
  )

  this.action.on('history-undo', () => {
    undo.call(this)
    this.updateVisibleModuleMap()
    this.action.dispatch('visible-module-update')
    this.events.onHistoryUpdated?.(this.history)
  })

  this.action.on('history-redo', () => {
    redo.call(this)
    this.updateVisibleModuleMap()
    this.action.dispatch('visible-module-update')
    this.events.onHistoryUpdated?.(this.history)
  })

  this.action.on('history-pick', (data) => {
    pick.call(this, data)
    this.updateVisibleModuleMap()
    this.action.dispatch('visible-module-update')
    this.events.onHistoryUpdated?.(this.history)
  })

  this.action.on('context-menu', ({idSet, position, copiedItems}) => {
    this.events.onContextMenu?.(idSet, position, copiedItems)
  })
}
