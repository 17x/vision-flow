import {fitRectToViewport} from './viewport/helper.ts'
import resetCanvas from './viewport/resetCanvas.tsx'
import {SelectionModifyData} from './actions/type'
import Editor from './editor.ts'

export function initEditor(this: Editor) {
  const {container, viewport, action} = this

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

  this.action.on('world-mouse-move', (data) => {
    this.events.onWorldMouseMove?.(data as Point)
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
    resetCanvas(this.viewport.mainCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
    this.renderModules()
  })

  this.action.on('visible-selected-update', (data) => {
    resetCanvas(this.viewport.selectionCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
    this.renderSelections(data.idSet as Set<UID>)
  })

  this.action.on('visible-module-update', () => {
    this.dispatchVisibleSelectedModules()
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
    this.batchDelete(this.isSelectAll ? 'all' : this.selectedModules, 'history-delete')
    this.selectedModules.clear()
    this.isSelectAll = false
    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})
  })

  this.action.on('selection-copy', () => {
    this.copiedItems = this.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsDelta()
  })

  this.action.on('selection-paste', () => {
    const newModules = this.batchCreate(this.copiedItems)
    this.batchAdd(newModules, 'history-paste')
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
    this.batchAdd(newModules, 'history-duplicate')
    this.isSelectAll = false
    this.replace(new Set(newModules.keys()))

    this.dispatchVisibleSelectedModules()
    this.updateVisibleModuleMap()
    this.action.dispatch({type: 'visible-module-update'})
  })

  /*
      this.action.on('module-delete', () => {
        this.selectedModules.clear()
        this.isSelectAll = false
        this.dispatchVisibleSelectedModules()
      })*/

  /*this.action.on('module-delete', () => {
    // this.batchDelete()
    this.updateVisibleModuleMap(this.viewport.worldRect)
    this.action.dispatch({type: 'visible-module-update', data: this.getVisibleModuleMap()})
  })*/
}
