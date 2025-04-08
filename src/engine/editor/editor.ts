import {ModuleOperationType, EventHandlers} from './type'
import History from './history/history.ts'
import Action from './actions/actions.ts'
import {HistoryOperationType} from './history/type'
import {generateBoundingRectFromTwoPoints, rectsOverlap} from '../core/utils.ts'
import {batchAdd, batchCopy, batchCreate, batchDelete, batchModify, batchMove} from './modules/modules.ts'
import {OperationHandler, SelectionActionMode} from './selection/type'
import {modifySelection, updateVisibleSelectedModules} from './selection/helper.ts'
import {updateScrollBars} from './viewport/domManipulations.ts'
import resetCanvas from './viewport/resetCanvas.tsx'
import render from '../core/renderer/mainCanvasRenderer.ts'
import selectionRender from './viewport/selectionRender.ts'
import {screenToCanvas} from '../lib/lib.ts'
import {Viewport, ViewportManipulationType} from './viewport/type'
import {createViewport} from './viewport/createViewport.ts'
import {SelectionModifyData} from './actions/type'
import {fitRectToViewport} from './viewport/helper.ts'

export interface EditorDataProps {
  id: UID;
  modules: ModuleType[];
}

export interface EditorConfig {
  dpr: number
}

export interface EditorInterface {
  container: HTMLDivElement
  data: EditorDataProps
  events?: EventHandlers
  config?: EditorConfig
}

const CopyDeltaX = 50
const CopyDeltaY = 100

class Editor {
  readonly id: UID
  config: EditorConfig
  private moduleCounter = 0
  readonly moduleMap: ModuleMap
  private readonly visibleModuleMap: ModuleMap
  readonly action: Action
  readonly container: HTMLDivElement
  events: EventHandlers = {}
  history: History
  viewport: Viewport
  readonly selectedModules: Set<UID> = new Set()
  readonly visibleSelectedModules: Set<UID> = new Set()
  readonly operationHandlers: Set<OperationHandler> = new Set()
  isSelectAll: boolean = false
  resizeHandleSize: number = 10
  copiedItems: ModuleProps[] = []
  hoveredModules: Set<UID> = new Set()
  handlingModules: Set<UID> = new Set()
  manipulationStatus: ViewportManipulationType = 'static'

  constructor({
                container,
                data,
                events = {},
                config = {
                  dpr: 2,
                },
              }: EditorInterface) {

    this.visibleModuleMap = new Map()
    this.id = data.id
    this.config = config
    this.events = events
    this.action = new Action()
    this.container = container
    this.history = new History(this)
    this.viewport = createViewport.call(this)
    this.moduleMap = data.modules.reduce<ModuleMap>(
      (acc, curr) => {
        acc.set(curr.id, curr)

        return acc
      },
      new Map<UID, ModuleType>(),
    )
    this.init()
  }

  private init() {
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
      this.action.dispatch({type: 'world-update', data: {...this.viewport.worldRect}})
      // this.viewport.render()
    })

    this.action.on('world-shift', () => {
      this.updateWorldRect()
      this.action.dispatch({type: 'world-update', data: {...this.viewport.worldRect}})
    })

    this.action.on('viewport-panning', (data) => {
      this.viewport.offset.x += (data as Point).x
      this.viewport.offset.y += (data as Point).y
      this.updateWorldRect()
      this.action.dispatch({type: 'world-update', data: {...this.viewport.worldRect}})
    })
    // this.action.subscribe('world-update', () => { })
    // this.action.subscribe('world-zoom', () => {    })

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

    this.action.on('selection-modify', (data) => {
      const {mode, idSet} = data as SelectionModifyData

      this.modifySelection(idSet, mode)
      this.dispatchVisibleSelectedModules()
    })

    this.action.on('selection-clear', () => {
      this.selectedModules.clear()
      this.isSelectAll = false
      this.dispatchVisibleSelectedModules()
    })
    this.action.on('module-delete', () => {
      this.selectedModules.clear()
      this.isSelectAll = false
      this.dispatchVisibleSelectedModules()
    })

    this.action.on('world-mouse-move', (data) => {
      this.events.onWorldMouseMove?.(data as Point)
    })

    this.action.on('world-update', (worldRect) => {
      this.updateVisibleModuleMap(worldRect as BoundingRect)
      this.events.onViewportUpdated?.(worldRect as BoundingRect)
      this.action.dispatch({type: 'visible-module-update', data: this.getVisibleModuleMap()})
    })

    this.action.on('module-delete', () => {
      // this.batchDelete()
      this.updateVisibleModuleMap(this.getWorldRect())
      this.action.dispatch({type: 'visible-module-update', data: this.getVisibleModuleMap()})
    })

  }

  get createModuleId(): UID {
    return this.id + '-' + (++this.moduleCounter)
  }

  batchCreate(moduleDataList: ModuleProps[]): ModuleMap {
    return batchCreate.call(this, moduleDataList)
  }

  batchAdd(modules: ModuleMap, historyCode?: Extract<HistoryOperationType, 'history-add' | 'history-paste' | 'history-duplicate'>) {
    return batchAdd.call(this, modules, historyCode)
  }

  batchCopy(from: 'all' | Set<UID>, removeId = false, addOn?: { string: unknown }): ModuleProps[] {
    return batchCopy.call(this, from, removeId, addOn)
  }

  batchDelete(from: 'all' | Set<UID>, historyCode?: Extract<HistoryOperationType, 'history-delete'>) {
    return batchDelete.call(this, from, historyCode)
  }

  batchMove(from: 'all' | Set<UID>, delta: Point, historyCode?: Extract<HistoryOperationType, 'history-move'>) {
    batchMove.call(this, from, delta, historyCode)
  }

  batchModify(from: 'all' | Set<UID>, data: Partial<ModuleProps>, historyCode?: HistoryOperationType) {
    batchModify.call(this, from, data, historyCode)
  }

  getModulesByLayerIndex() {

  }

  getModulesByIdSet(idSet: Set<UID>): ModuleMap {
    const result: ModuleMap = new Map()

    idSet.forEach(id => {
      const mod = this.moduleMap.get(id)
      if (mod) {
        result.set(id, mod)
      }
    })

    return result
  }

  getModuleList(): ModuleType[] {
    return [...Object.values(this.moduleMap)]
  }

  updateVisibleModuleMap(worldRect: BoundingRect) {
    this.visibleModuleMap.clear()

    this.moduleMap.forEach((module) => {
      const boundingRect = module.getBoundingRect() as BoundingRect

      if (rectsOverlap(boundingRect, worldRect)) {
        this.visibleModuleMap.set(module.id, module)
      }
    })
  }

  getVisibleModuleMap(): ModuleMap {
    return new Map(this.visibleModuleMap)
  }

  public execute(type: ModuleOperationType, data: unknown = null) {
    // @ts-ignore
    this.action.execute({type, data})
  }

  // selection
  dispatchVisibleSelectedModules() {
    this.updateVisibleSelectedModules()
    this.action.dispatch({
      type: 'visible-selected-update',
      data: {
        idSet: this.getVisibleSelectedModules(),
        operators: this.operationHandlers,
      },
    })
  }

  public updateVisibleSelectedModules() {
    updateVisibleSelectedModules.call(this)
  }

  public getVisibleSelectedModules() {
    return new Set(this.visibleSelectedModules)
  }

  public getSelected(): Set<UID> | 'all' {
    if (this.isSelectAll) {
      return 'all'
    }
    return new Set(this.selectedModules.keys())
  }

  public modifySelection(idSet: Set<UID>, action: SelectionActionMode) {
    modifySelection.call(this, idSet, action)
  }

  public add(idSet: Set<UID>) {
    modifySelection.call(this, idSet, 'add')
  }

  public delete(idSet: Set<UID>) {
    modifySelection.call(this, idSet, 'delete')
  }

  public toggle(idSet: Set<UID>) {
    modifySelection.call(this, idSet, 'toggle')
  }

  public replace(idSet: Set<UID>) {
    modifySelection.call(this, idSet, 'replace')
  }

  public selectAll(): void {
    this.selectedModules.clear()
    this.isSelectAll = true
    // this.update()
    this.events.onSelectionUpdated?.('all', null)
  }

  public copySelected(): void {
    this.copiedItems = []

    this.copiedItems = this.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsDelta()
  }

  public pasteCopied(): void {
    const newModules = this.batchCreate(this.copiedItems)
    this.batchAdd(newModules, 'history-paste')
    this.replace(new Set(newModules.keys()))
    this.updateCopiedItemsDelta()
  }

  public duplicateSelected(): void {
    let temp: ModuleProps[]

    if (this.isSelectAll) {
      temp = this.batchCopy('all', true)
    } else {
      temp = this.batchCopy(this.selectedModules, true)
    }

    temp.forEach(copiedItem => {
      copiedItem!.x += CopyDeltaX
      copiedItem!.y += CopyDeltaY
    })

    const newModules = this.batchCreate(temp)
    this.batchAdd(newModules, 'history-duplicate')
    this.isSelectAll = false
    this.replace(new Set(newModules.keys()))
  }

  /*
    public removeSelected(): void {
      if (this.isSelectAll) {
        this.batchDelete('all', 'history-delete')
      } else {
        this.batchDelete(this.selectedModules, 'history-delete')
      }

      // this.clear()
    }*/

  private updateCopiedItemsDelta(): void {
    this.copiedItems.forEach(copiedItem => {
      copiedItem!.x += CopyDeltaX
      copiedItem!.y += CopyDeltaY
    })
  }

  public getIfUnique() {
    if (this.selectedModules.size === 1) return [...this.selectedModules.values()][0]
    return null
  }

  // viewport
  renderModules() {
    const animate = () => {
      render({
        ctx: this.viewport.mainCTX,
        frame: this.viewport.frame,
        modules: this.getVisibleModuleMap(),
      })
    }

    requestAnimationFrame(animate)
  }

  renderSelections(modules: Set<UID>) {
    // console.log(modules)
    const animate = () => {
      selectionRender.call(this, modules)
    }

    requestAnimationFrame(animate)
  }

  updateWorldRect() {
    const {width, height} = this.viewport.viewportRect
    const p1 = this.getWorldPointByViewportPoint(0, 0)
    const p2 = this.getWorldPointByViewportPoint(width, height)

    this.viewport.worldRect = generateBoundingRectFromTwoPoints(p1, p2)
  }

  getWorldRect() {
    return {...this.viewport.worldRect}
  }

  /*
    zoom(idx: number, point?: Point) {
      // console.log(idx)
      const minZoom = 0.1;
      const maxZoom = 10;
      this.viewport.scale += idx;
      // console.log(point)
      // console.log(this.viewport.currentZoom)
      if (this.viewport.scale < minZoom) {
        this.viewport.scale = minZoom;
      }
      if (this.viewport.scale > maxZoom) {
        this.viewport.scale = maxZoom;
      }

      this.viewport.updateVirtualRect();
      this.viewport.render();
    }
  */

  zoomAtPoint(point: Point, zoom: number, zoomTo: boolean = false) {
    const {offset, scale, dpr} = this.viewport
    const minScale = 0.1
    const maxScale = 5
    let newScale = scale + zoom
    // const offsetX = 0
    // const offsetY = 0
    const pointX = point.x * scale
    const pointY = point.y * scale
    const rect = {
      x: 0,
      y: 0,
      width: this.viewport.rect!.width * dpr,
      height: this.viewport.rect!.height * dpr,
    }
    /*    console.log(
      pointX,
      pointY,
      rect,
    )*/
    if (zoomTo) {
      newScale = zoom
    }

    if (newScale < minScale || newScale > maxScale) return

    // Clamp scale
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale))

    // Calculate zoom factor
    const zoomFactor = clampedScale / scale

    // Convert screen point to canvas coordinates before zoom
    const canvasPoint = this.viewport.getWorldPointByViewportPoint(point.x, point.y)

    // Calculate the offset adjustment so that the zoom is centered around the point
    const newOffsetX = canvasPoint.x - (canvasPoint.x - offset.x) * zoomFactor
    const newOffsetY = canvasPoint.y - (canvasPoint.y - offset.y) * zoomFactor

    // const newOffsetX = offset.x - (canvasPoint.x * (zoomFactor - 1))
    // const newOffsetY = offset.y - (canvasPoint.y * (zoomFactor - 1))

    // Apply updated values
    this.viewport.scale = clampedScale
    this.viewport.offset.x = newOffsetX
    this.viewport.offset.y = newOffsetY
    // this.viewport.render()
    this.updateWorldRect()
  }

  zoomTo(newScale: number | 'fit') {
    console.log(newScale)
    if (newScale === 'fit') {
      this.viewport.fitFrame()
    } else {
      this.viewport.zoomAtPoint(
        {
          x: this.viewport.rect!.width / 2,
          y: this.viewport.viewportRect.height / 2,
        },
        newScale,
        true,
      )
    }
  }

  setTranslateViewport(x: number, y: number) {
    this.viewport.offset.x = 0
    this.viewport.offset.y = 0
    this.viewport.translateViewport(x, y)
  }

  translateViewport(x: number, y: number) {
    this.viewport.offset.x += x
    this.viewport.offset.y += y
    // this.viewport.updateWorldRect()
    // this.viewport.render()
  }

  updateScrollBar() {
    const {scrollBarX, scrollBarY} = this.viewport

    updateScrollBars(scrollBarX, scrollBarY)
  }

  updateViewport() {
    const {dpr, mainCanvas, selectionCanvas} = this.viewport
    const rect = this.container.getBoundingClientRect().toJSON()
    const {x, y, width, height} = rect
    const viewportWidth = width * dpr
    const viewportHeight = height * dpr

    this.viewport.rect = {...rect, cx: x + width / 2, cy: y + height / 2}
    this.viewport.viewportRect = generateBoundingRectFromTwoPoints(
      {x: 0, y: 0},
      {x: viewportWidth, y: viewportHeight},
    )

    mainCanvas.width = selectionCanvas.width = viewportWidth
    mainCanvas.height = selectionCanvas.height = viewportHeight
  }

  getWorldPointByViewportPoint(x: number, y: number) {
    const {dpr, offset, scale} = this.viewport

    return screenToCanvas(
      scale,
      offset.x * dpr,
      offset.y * dpr,
      x * dpr,
      y * dpr,
    )
  }

  fitFrame() {
    console.log('fit')
    // const {frame, viewportRect} = this
    /* const testFrame = generateBoundingRectFromRotatedRect({
       x: 800,
       y: 800,
       width: 100,
       height: 100
     }, 50)*/
    // console.log(testFrame)
    // console.log(frame)

    // const {scale, offsetX, offsetY} = fitRectToViewport(frame, viewportRect)

    // console.log(virtualRect)
    // console.log(scale, offsetX, offsetY)
    /*
        this.viewport.scale = scale
        this.viewport.offset.x = offsetX
        this.viewport.offset.y = offsetY*/
    // this.viewport.render()
    // this.viewport.updateWorldRect()
  }

  resetSelectionCanvas() {
    resetCanvas(this.viewport.selectionCTX, this.viewport.dpr, this.viewport.scale, this.viewport.offset)
  }

  renderMainCanvas() {
    const animate = () => {
      render({
        ctx: this.viewport.mainCTX,
        frame: this.viewport.frame,
        modules: this.getVisibleModuleMap(),
      })
    }

    requestAnimationFrame(animate)
  }

  renderSelectionCanvas() {
    const animate = () => {
      selectionRender.call(this)
    }

    requestAnimationFrame(animate)
  }

  // render
  render() {
  }

  //eslint-disable-block
  destroy() {
    // this.removeEventListeners()
    // this.panableContainer.destroy()
    this.action.destroy()
    this.destroy()
    this.history.destroy()
    // destoryViewport(this.viewport)
    this.moduleMap.clear()
  }

}

export default Editor
