import {EditorConfig, EventHandlers} from './type'
import History from './history/history.ts'
import Action from './actions/actions.ts'
import {generateBoundingRectFromTwoPoints, rectsOverlap} from '../core/utils.ts'
import {batchAdd, batchCopy, batchCreate, batchDelete, batchModify, batchMove} from './modules/moduleModify.ts'
import {OperationHandlers, ResizeHandler, SelectionActionMode} from './selection/type'
import {modifySelected} from './selection/helper.ts'
import {updateScrollBars} from './viewport/domManipulations.ts'
import selectionRender from './viewport/selectionRender.ts'
import {screenToWorld, worldToScreen} from '../lib/lib.ts'
import {Viewport, ViewportManipulationType} from './viewport/type'
import {createViewport} from './viewport/createViewport.ts'
import {destroyViewport} from './viewport/destroyViewport.ts'
import {initEditor} from './initEditor.ts'
import {VisionEventType} from './actions/type'
import {zoomAtPoint} from './viewport/helper.ts'
import AssetsManager, {AssetsObj} from '@editor/engine/assetsManager/AssetsManager.ts'
import ElementImage from '../core/modules/shapes/image.ts'
import {BoundingRect, Point} from '@editor/type.ts'
import nid from '@editor/lib/nid.ts'
import Rectangle from '@editor/core/modules/shapes/rectangle.ts'
import {Tool} from '@editor/engine/tools/tool.ts'

class Editor {
  id = nid()
  // readonly id: UID
  config: EditorConfig
  // private moduleCounter = 0
  readonly moduleMap: ModuleMap
  // private readonly snapPoints: SnapPointData[] = []
  private readonly visibleModuleMap: ModuleMap
  readonly action: Action
  readonly container: HTMLDivElement
  events: EventHandlers = {}
  history: History
  viewport: Viewport
  readonly selectedModules: Set<UID> = new Set()
  readonly visibleSelected: Set<UID> = new Set()
  readonly operationHandlers: OperationHandlers[] = []
  assetsManager: AssetsManager
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
  toolMap: Map<string, Tool> = new Map()
  CopyDeltaX = 50
  CopyDeltaY = 100
  initialized: boolean = false
  currentToolName: string = 'selector'

  constructor({
                container,
                elements,
                assets = [],
                events = {},
                config,
              }: {
    container: HTMLDivElement
    assets: AssetsObj[]
    elements: ModuleProps[]
    events?: EventHandlers;
    config: EditorConfig;
  }) {
    this.visibleModuleMap = new Map()
    this.config = config
    this.events = events
    this.action = new Action()
    this.container = container
    this.history = new History(this)
    this.viewport = createViewport.call(this)
    this.moduleMap = new Map()
    // this.moduleCounter = config.moduleIdCounter
    this.assetsManager = new AssetsManager(assets)

    initEditor.call(this)

    this.action.dispatch('module-add', elements)
  }

  batchCreate(moduleDataList: ModuleProps[]): ModuleMap {
    return batchCreate.call(this, moduleDataList)
  }

  batchAdd(modules: ModuleMap, callback?): ModuleMap {
    return batchAdd.call(this, modules, callback)
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

    // console.log(this.viewport.offset, this.viewport.worldRect)
    // Create an array from the Map, sort by the 'layer' property, and then add them to visibleModuleMap
    const sortedModules = ([...this.moduleMap.values()] as ModuleInstance[])
      .filter(module => {
        const boundingRect = module.getBoundingRect() as BoundingRect
        return rectsOverlap(boundingRect, this.viewport.worldRect)
      })
      .sort((a, b) => a.layer - b.layer)
    // console.log(this.moduleMap)
    sortedModules.forEach(module => {
      this.visibleModuleMap.set(module.id, module)
    })
  }

  /*updateSnapPoints() {
    this.snapPoints.length = 0
    this.visibleModuleMap.forEach(module => {
      this.snapPoints.push(...module.getSnapPoints())
    })
  }*/

  updateVisibleSelected() {
    this.visibleSelected.clear()
    this.operationHandlers.length = 0

    this.getVisibleModuleMap.forEach((module) => {
      if (this.selectedModules.has(module.id)) {
        this.visibleSelected.add(module.id)
      }
    })

    const moduleProps = this.getSelectedPropsIfUnique

    if (moduleProps) {
      const module = this.moduleMap.get(moduleProps.id)
      const {scale, dpr} = this.viewport
      const lineWidth = 1 / scale * dpr
      const resizeSize = 10 / scale * dpr
      const rotateSize = 15 / scale * dpr
      const lineColor = '#5491f8'

      const operators = module!.getOperators({
        size: resizeSize,
        lineColor,
        lineWidth,
        fillColor: '#fff',
      }, {
        size: rotateSize,
        lineColor: 'transparent',
        lineWidth: 0,
        fillColor: 'transparent',
      })

      this.operationHandlers.push(...operators)
    }
  }

  public createElement(props):ModuleInstance {

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

  public get getMaxLayerIndex(): number {
    let max = 0
    this.moduleMap.forEach((mod) => {
      // console.log(mod.layer)
      if (mod.layer > max) {
        max = mod.layer
      }
    })

    return max
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
        return module.getDetails()
      }

      return null
    }
    return null
  }

  public execute(type: VisionEventType, data: unknown = null) {
    // console.log('Editor', type)
    // @ts-ignore
    this.action.execute(type, data)
  }

  // viewport
  renderModules() {
    // console.log('renderModules')
    const animate = () => {
      const {scale, dpr, mainCTX: ctx} = this.viewport
      const frameBorder = {
        id: nid() + '-frame',
        x: this.config.page.width / 2,
        y: this.config.page.height / 2,
        width: this.config.page.width,
        height: this.config.page.height,
        fillColor: 'transparent',
        enableLine: true,
        lineWidth: 1 / scale * dpr,
        lineColor: '#000',
        layer: -1,
        opacity: 100,
      }

      const frameFill = {...frameBorder, fillColor: '#fff', enableLine: false}
      // deduplicateObjectsByKeyValue()
      // console.log(this.visibleModuleMap.size)
      // deduplicateObjectsByKeyValue

      new Rectangle(frameFill).render(ctx)

      this.visibleModuleMap.forEach((module) => {
        if (module.type === 'image') {
          const {src} = module as ElementImage

          const obj = this.assetsManager.getAssetsObj(src)
          console.log(this.assetsManager, src)
          if (obj) {
            (module as ElementImage).render(ctx, obj.imageRef)
          }
        } else {
          module.render(ctx)

        }
      })

      new Rectangle(frameBorder).render(ctx)
    }

    requestAnimationFrame(animate)
  }

  /*  public get getModulesInsideOfFrame(): ModuleInstance[] {
      const arr = []
      this.moduleMap.forEach((module) => {

      })
    }*/

  public printOut(ctx: CanvasRenderingContext2D): void {
    this.moduleMap.forEach((module) => {
      module.render(ctx)
    })
  }

  public export(): { elements: ModuleProps[], assets: never[], config: { offset: { x: number, y: number } } } {
    const {scale, offset} = this.viewport
    const assetSet = new Set<string>()
    const result = {
      elements: [],
      config: {
        scale,
        offset,
      },
      assets: [],
    }

    this.moduleMap.forEach((module) => {
      if (module.type === 'image') {
        const {src} = module as ElementImage
        if (!src) return

        const r = this.assetsManager.getAssetsObj(src)

        if (r) {
          if (!assetSet.has(src)) {
            assetSet.add(src)
            result.assets.push(r)
          }
          console.log(result.assets)
        }
      }

      result.elements.push(module.getDetails())
    })

    return result
  }

  renderSelections() {
    // console.log('renderSelections')

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
    // console.log('worldRect', this.viewport.worldRect)
  }

  zoom(zoom: number, point?: Point): { x: number, y: number } {
    const {rect} = this.viewport

    point = point || {x: rect.width / 2, y: rect.height / 2}

    return zoomAtPoint.call(this, point, zoom)
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

  //eslint-disable-block
  destroy() {
    destroyViewport.call(this)
    this.action.destroy()
    this.history.destroy()
    this.moduleMap.clear()
  }
}

export default Editor
