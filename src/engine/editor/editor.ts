import {ModuleOperationType, EventHandlers} from './type'
import History from './history/history.ts'
import Action from './actions/actions.ts'
import {HistoryOperationType} from './history/type'
import {generateBoundingRectFromTwoPoints, rectsOverlap} from '../core/utils.ts'
import {batchAdd, batchCopy, batchCreate, batchDelete, batchModify, batchMove} from './modules/modules.ts'
import {OperationHandler, SelectionActionMode} from './selection/type'
import {modifySelection, updateVisibleSelectedModules} from './selection/helper.ts'
import {updateScrollBars} from './viewport/domManipulations.ts'
import render from '../core/renderer/mainCanvasRenderer.ts'
import selectionRender from './viewport/selectionRender.ts'
import {screenToCanvas} from '../lib/lib.ts'
import {Viewport, ViewportManipulationType} from './viewport/type'
import {createViewport} from './viewport/createViewport.ts'
import {destroyViewport} from './viewport/destroyViewport.ts'
import {initEditor} from './initEditor.ts'

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
  draggingModules: Set<UID> = new Set()
  selectingModules: Set<UID> = new Set()
  selectedShadow: Set<UID> = new Set()
  manipulationStatus: ViewportManipulationType = 'static'
  CopyDeltaX = 50
  CopyDeltaY = 100

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
    initEditor.call(this)
  }

  get createModuleId(): UID {
    return this.id + '-' + (++this.moduleCounter)
  }

  batchCreate(moduleDataList: ModuleProps[]): ModuleMap {
    return batchCreate.call(this, moduleDataList)
  }

  batchAdd(modules: ModuleMap) {
    return batchAdd.call(this, modules)
  }

  batchCopy(from: 'all' | Set<UID>, removeId = false, addOn?: { string: unknown }): ModuleProps[] {
    return batchCopy.call(this, from, removeId, addOn)
  }

  batchDelete(from: 'all' | Set<UID>) {
    return batchDelete.call(this, from)
  }

  batchMove(from: 'all' | Set<UID>, delta: Point) {
    batchMove.call(this, from, delta)
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

  updateVisibleModuleMap() {
    this.visibleModuleMap.clear()

    this.moduleMap.forEach((module) => {
      const boundingRect = module.getBoundingRect() as BoundingRect

      if (rectsOverlap(boundingRect, this.viewport.worldRect)) {
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

  public getSelectedIdSet(): Set<UID> {
    if (this.isSelectAll) {
      const idSet = new Set<UID>()

      this.moduleMap.forEach((module) => {
        idSet.add(module.id)
      })

      return idSet
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

  updateCopiedItemsDelta(): void {
    this.copiedItems.forEach(copiedItem => {
      copiedItem!.x += this.CopyDeltaX
      copiedItem!.y += this.CopyDeltaY
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
        modules: this.visibleModuleMap,
      })
    }

    requestAnimationFrame(animate)
  }

  renderSelections(modules: Set<UID>) {
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

  zoomAtPoint(point: Point, zoom: number, zoomTo: boolean = false): {
    scale: number,
    offset: {
      x: number,
      y: number,
    },
  } {
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
    const canvasPoint = this.getWorldPointByViewportPoint(point.x, point.y)

    // Calculate the offset adjustment so that the zoom is centered around the point
    const newOffsetX = canvasPoint.x - (canvasPoint.x - offset.x) * zoomFactor
    const newOffsetY = canvasPoint.y - (canvasPoint.y - offset.y) * zoomFactor

    // const newOffsetX = offset.x - (canvasPoint.x * (zoomFactor - 1))
    // const newOffsetY = offset.y - (canvasPoint.y * (zoomFactor - 1))

    // Apply updated values
    // this.viewport.scale = clampedScale
    // this.viewport.offset.x = newOffsetX
    // this.viewport.offset.y = newOffsetY

    return {
      scale: clampedScale,
      offset: {
        x: newOffsetX,
        y: newOffsetY,
      },
    }
    // this.viewport.render()
    // this.updateWorldRect()
  }

  zoomTo(newScale: number | 'fit') {
    console.log(newScale)
    if (newScale === 'fit') {
      // this.fitFrame()
    } else {
      this.zoomAtPoint(
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
    this.translateViewport(x, y)
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

  //eslint-disable-block
  destroy() {
    destroyViewport.call(this)
    this.action.destroy()
    this.history.destroy()
    this.moduleMap.clear()
  }

}

export default Editor
