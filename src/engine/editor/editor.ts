import {EventHandlers} from './type'
import History from './history/history.ts'
import Action from './actions/actions.ts'
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
} from './modules/moduleModify.ts'
import {OperationHandlers, ResizeHandler, SelectionActionMode} from './selection/type'
import {
  modifySelected,
} from './selection/helper.ts'
import {updateScrollBars} from './viewport/domManipulations.ts'
import selectionRender from './viewport/selectionRender.ts'
import {worldToScreen, screenToWorld, createHandlersForRect} from '../lib/lib.ts'
import {Viewport, ViewportManipulationType} from './viewport/type'
import {createViewport} from './viewport/createViewport.ts'
import {destroyViewport} from './viewport/destroyViewport.ts'
import {initEditor} from './initEditor.ts'
import {fitRectToViewport} from './viewport/helper.ts'
import uid from '../../utilities/Uid.ts'
import {EditorEventType} from './actions/type'
import {CenterBasedRect} from '../type'

export interface EditorDataProps {
  id: UID;
  modules: ModuleInstance[];
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
  _resizingOperator: ResizeHandler | null = null
  _rotatingOperator: OperationHandlers | null = null
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
    this.id = data.id || uid()
    this.config = config
    this.events = events
    this.action = new Action()
    this.container = container
    this.history = new History(this)
    this.viewport = createViewport.call(this)
    this.moduleMap = data.modules.reduce<ModuleMap>((acc, curr) => {
      acc.set(curr.id, curr)

      return acc
    }, new Map<UID, ModuleInstance>())

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
    includeIdentifiers = true,
  ): ModuleProps[] {
    return batchCopy.call(this, from, includeIdentifiers)
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
  ) {
    batchModify.call(this, idSet, data)
  }

  // getModulesByLayerIndex() {}

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

  getModuleList(): ModuleInstance[] {
    return [...Object.values(this.moduleMap)]
  }

  updateVisibleModuleMap() {
    this.visibleModuleMap.clear()

    // Create an array from the Map, sort by the 'layer' property, and then add them to visibleModuleMap
    const sortedModules = ([...this.moduleMap.values()] as ModuleInstance[])
      .filter(module => {
        const boundingRect = module.getBoundingRect() as BoundingRect
        return rectsOverlap(boundingRect, this.viewport.worldRect)
      })
      .sort((a, b) => a.layer - b.layer)

    sortedModules.forEach(module => {
      this.visibleModuleMap.set(module.id, module)
    })
  }

  updateVisibleSelected() {
    this.visibleSelected.clear()
    this.operationHandlers.clear()

    this.getVisibleModuleMap.forEach((module) => {
      if (this.selectedModules.has(module.id)) {
        this.visibleSelected.add(module.id)
      }
    })

    const module = this.getSelectedPropsIfUnique

    if (module) {
      const {scale, dpr} = this.viewport
      console.log('create')
      createHandlersForRect(module, scale, dpr).forEach(
        (p) => {
          // console.log(p.data,p.cursor)
          // p.data.width = localHandlerWidth / this.viewport.scale * this.viewport.dpr
          // p.data.lineWidth = localHandlerBorderWidth / this.viewport.scale * this.viewport.dpr
          this.operationHandlers.add(p)
        },
      )
    }
  }

  public get getVisibleModuleMap(): ModuleMap {
    return new Map(this.visibleModuleMap)
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

  public get getNextLayerIndex(): number {
    let max = 0

    this.moduleMap.forEach((mod) => {
      if (mod.layer > max) {
        max = mod.layer
      }
    })

    return max + 1
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

  public get getSelectedPropsIfUnique(): ModuleProps | null {
    if (this.selectedModules.size === 1) {
      const unique = [...this.selectedModules.values()][0]
      const module = this.moduleMap.get(unique)

      if (module) {
        return this.moduleMap.get(unique).getDetails()
      }

      return null
    }
    return null
  }

  public execute(type: EditorEventType, data: unknown = null) {
    // @ts-ignore
    this.action.execute(type, data)
  }

  // viewport
  renderModules() {
    const animate = () => {
      const {frame, mainCTX: ctx} = this.viewport

      frame.render(ctx)

      // deduplicateObjectsByKeyValue
      this.visibleModuleMap.forEach((module) => {
          module.render(ctx)
        },
      )
    }

    requestAnimationFrame(animate)
  }

  renderSelections() {
    const animate = () => {
      selectionRender.call(this)
    }

    requestAnimationFrame(animate)
  }

  updateWorldRect() {
    const {dpr} = this.viewport
    const {width, height} = this.viewport.viewportRect
    const p1 = this.getWorldPointByViewportPoint(0, 0)
    const p2 = this.getWorldPointByViewportPoint(width / dpr, height / dpr)

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
    const {offset, scale: oldScale, dpr, frame, rect, viewportRect, worldRect} = this.viewport
    const minScale = 0.01 * dpr
    const maxScale = 500 * dpr
    // let newScale = zoomTo ? zoom : oldScale + zoom
    const pixelOffsetX = point.x - rect.width / 2
    const pixelOffsetY = point.y - rect.height / 2
    const centerAreaThresholdX = rect.width / 8
    const centerAreaThresholdY = rect.height / 8
    const f = fitRectToViewport(worldRect, viewportRect, -zoom)
    let newOffsetX = f.offsetX / dpr
    let newOffsetY = f.offsetY / dpr
    let newScale = f.scale

    if (Math.abs(pixelOffsetX) > centerAreaThresholdX) {
      console.log('offsetX', pixelOffsetX)
      newOffsetX = newOffsetX - pixelOffsetX * zoom * 2
    }

    if (Math.abs(pixelOffsetY) > centerAreaThresholdY) {
      console.log('offsetY', pixelOffsetY)
      newOffsetY = newOffsetY - pixelOffsetY * zoom * 2
    }
    return {
      scale: newScale,
      offset: {
        x: newOffsetX,
        y: newOffsetY,
      },
    }
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

    return screenToWorld(
      {x, y},
      offset,
      scale,
      dpr,
    )
  }

  getViewPointByWorldPoint(x: number, y: number) {
    const {dpr, offset, scale} = this.viewport

    return worldToScreen(
      {x, y},
      offset,
      scale,
      dpr,
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
    const frameRect = frame.getBoundingRect()
    const {scale, offsetX, offsetY} = fitRectToViewport(frameRect, viewportRect, 0.02)

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
