import {OperationType, EventHandlers} from './type'
import History from './history/history.ts'
import Action from './actions/actions.ts'
import {HistoryOperationType} from './history/type'
import {
  generateBoundingRectFromTwoPoints,
  rectsOverlap,
} from '../core/utils.ts'
import {
  batchAdd,
  batchCopy,
  batchCreate,
  batchDelete,
  batchModify,
  batchMove,
} from './modules/modules.ts'
import {OperationHandler, OperationHandlers, ResizeHandler, SelectionActionMode} from './selection/type'
import {
  modifySelected,
} from './selection/helper.ts'
import {updateScrollBars} from './viewport/domManipulations.ts'
import render from '../core/renderer/mainCanvasRenderer.ts'
import selectionRender from './viewport/selectionRender.ts'
import {screenToCanvas} from '../lib/lib.ts'
import {Viewport, ViewportManipulationType} from './viewport/type'
import {createViewport} from './viewport/createViewport.ts'
import {destroyViewport} from './viewport/destroyViewport.ts'
import {initEditor} from './initEditor.ts'
import {fitRectToViewport} from './viewport/helper.ts'

export interface EditorDataProps {
  id: UID;
  modules: ModuleType[];
}

export interface EditorConfig {
  dpr: number;
}

export interface EditorInterface {
  container: HTMLDivElement
  data: EditorDataProps
  events?: EventHandlers;
  config?: EditorConfig;
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
  readonly visibleSelected: Set<UID> = new Set()
  readonly operationHandlers: Set<OperationHandlers> = new Set()

  // resizeHandleSize: number = 10
  copiedItems: ModuleProps[] = []
  hoveredModule: UID | null = null
  // highlightedModules: Set<UID> = new Set()
  draggingModules: Set<UID> = new Set()
  _selectingModules: Set<UID> = new Set()
  _deselection: UID | null = null
  _resizingOperator: ResizeHandler | null
  selectedShadow: Set<UID> = new Set()
  manipulationStatus: ViewportManipulationType = 'static'
  CopyDeltaX = 50
  CopyDeltaY = 100
  initialized: boolean = false

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
    this.moduleMap = data.modules.reduce<ModuleMap>((acc, curr) => {
      acc.set(curr.id, curr)

      return acc
    }, new Map<UID, ModuleType>())

    this.init()
  }

  private init() {
    initEditor.call(this)
  }

  get createModuleId(): UID {
    return this.id + '-' + ++this.moduleCounter
  }

  batchCreate(moduleDataList: ModuleProps[]): ModuleMap {
    return batchCreate.call(this, moduleDataList)
  }

  batchAdd(modules: ModuleMap): ModuleMap {
    return batchAdd.call(this, modules)
  }

  batchCopy(
    from: Set<UID>,
    removeId = false,
    addOn?: { string: unknown },
  ): ModuleProps[] {
    return batchCopy.call(this, from, removeId, addOn)
  }

  batchDelete(from: Set<UID>): ModuleProps[] {
    return batchDelete.call(this, from)
  }

  batchMove(from: Set<UID>, delta: Point) {
    batchMove.call(this, from, delta)
  }

  batchModify(
    idSet: Set<UID>,
    data: Partial<ModuleProps>,
    historyCode?: HistoryOperationType,
  ) {
    batchModify.call(this, idSet, data, historyCode)
  }

  getModulesByLayerIndex() {}

  getModulesByIdSet(idSet: Set<UID>): ModuleMap {
    const result: ModuleMap = new Map()

    idSet.forEach((id) => {
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
      // console.log(boundingRect,this.viewport.worldRect)
      if (rectsOverlap(boundingRect, this.viewport.worldRect)) {
        this.visibleModuleMap.set(module.id, module)
      }
    })
  }

  public get getVisibleModuleMap(): ModuleMap {
    return new Map(this.visibleModuleMap)
  }

  public execute(type: OperationType, data: unknown = null) {
    // @ts-ignore
    this.action.execute(type, data)
  }

  public get getVisibleSelected() {
    return new Set(this.visibleSelected)
  }

  public get getVisibleSelectedModuleMap() {
    return this.getModulesByIdSet(this.getVisibleSelected)
  }

  public get getSelected(): Set<UID> {
    return new Set(this.selectedModules)
  }

  public modifySelected(idSet: Set<UID>, action: SelectionActionMode) {
    modifySelected.call(this, idSet, action)
  }

  public addSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'add')
  }

  public deleteSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'delete')
  }

  public toggleSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'toggle')
  }

  public replaceSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'replace')
  }

  public selectAll(): void {
    this.selectedModules.clear()
    this.moduleMap.forEach((module) => {
      this.selectedModules.add(module.id)
    })

    // this.events.onSelectionUpdated?.(this.selectedModules)
  }

  updateCopiedItemsDelta(): void {
    this.copiedItems.forEach((copiedItem) => {
      copiedItem!.x += this.CopyDeltaX
      copiedItem!.y += this.CopyDeltaY
    })
  }

  public getSelectedPropsIfUnique() {
    if (this.selectedModules.size === 1) {
      const unique = [...this.selectedModules.values()][0]

      return this.moduleMap.get(unique).getDetails()
    }
    return null
  }

  // viewport
  renderModules() {
    // if (this.visibleModuleMap.size === 0) return

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

  zoomAtPoint(
    point: Point,
    zoom: number,
    zoomTo: boolean = false,
  ): {
    scale: number;
    offset: {
      x: number;
      y: number;
    };
  } | false {
    const {offset, scale, dpr} = this.viewport
    const minScale = 0.1 * dpr
    const maxScale = 5 * dpr
    let newScale = scale + zoom
    // const offsetX = 0
    // const offsetY = 0
    /* const pointX = point.x * scale
     const pointY = point.y * scale
     const rect = {
       x: 0,
       y: 0,
       width: this.viewport.rect!.width * dpr,
       height: this.viewport.rect!.height * dpr,
     }*/
    /*    console.log(
      pointX,
      pointY,
      rect,
    )*/
    if (zoomTo) {
      newScale = zoom
    }

    if (newScale < minScale || newScale > maxScale) {return false}

    // Clamp scale
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale))

    // Calculate zoom factor
    const zoomFactor = clampedScale / scale

    // Convert screen point to canvas coordinates before zoom
    const canvasPoint = this.getWorldPointByViewportPoint(point.x, point.y)

    // Calculate the offset adjustment so that the zoom is centered around the point
    const newOffsetX = canvasPoint.x - (canvasPoint.x - offset.x) * zoomFactor
    const newOffsetY = canvasPoint.y - (canvasPoint.y - offset.y) * zoomFactor
    /*    console.log({
          scale: clampedScale,
          offset: {
            x: newOffsetX,
            y: newOffsetY,
          },
        })*/
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
      this.fitFrame()
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
    const {frame, viewportRect, dpr} = this.viewport
    /* const testFrame = generateBoundingRectFromRotatedRect({
       x: 800,
       y: 800,
       width: 100,
       height: 100
     }, 50)*/
    // console.log(testFrame)
    // console.log(frame)
    // console.log(viewportRect)

    const {scale, offsetX, offsetY} = fitRectToViewport(frame, viewportRect, 0.95)

    // console.log(virtualRect)
    // console.log(scale, offsetX, offsetY)
    this.viewport.scale = scale
    this.viewport.offset.x = offsetX / dpr
    this.viewport.offset.y = offsetY / dpr
    // this.action.dispatch('world-update')
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
