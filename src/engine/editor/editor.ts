import SelectionManager from './selection/selectionManager.ts'
import {BasicEditorAreaSize, ModuleOperationType, EventHandlers} from './type'
import History from './history/history.ts'
import Rectangle from '../core/modules/shapes/rectangle.ts'
import deepClone from '../../utilities/deepClone.ts'
import typeCheck from '../../utilities/typeCheck.ts'
import TypeCheck from '../../utilities/typeCheck.ts'
import Action from './actions/actions.ts'
import Connector from '../core/modules/connectors/connector.ts'
import {HistoryOperationType} from './history/type'
import Viewport from './viewport/viewport.ts'

import {rectsOverlap} from '../core/utils.ts'
import {batchAdd, batchCopy, batchCreate, batchDelete, batchModify, batchMove} from './modules/modules.ts'

export interface EditorDataProps {
  id: UID;
  // size: Size;
  modules: ModuleType[];
}

export const basicEditorAreaSize: BasicEditorAreaSize = {
  width: 1000, height: 1000,
}

export interface EditorProps {
  container: HTMLDivElement
  data: EditorDataProps
  events?: EventHandlers
  // theme: ThemeShape
  // dpr?: DPR;
  // zoom?: ZoomRatio;
  // logicResolution?: Resolution;
  // physicalResolution?: Resolution;
}

class Editor {
  private id: UID
  private moduleCounter = 0
  readonly moduleMap: ModuleMap
  private readonly visibleModuleMap: ModuleMap
  readonly action: Action
  container: HTMLDivElement
  events: EventHandlers = {}
  history: History
  // public panableContainer: PanableContainer
  selectionManager: SelectionManager
  // private wrapper: HTMLDivElement
  viewport: Viewport
  // private zoom: ZoomRatio
  // private ctx: CanvasRenderingContext2D
  scale: number = 1
  // private minScale: number = 0.5
  // private maxScale: number = 10
  // private zoomSpeed: number = 0.1

  constructor({
                container,
                data, /*dpr = 2, */
                events = {},
              }: EditorProps) {
    this.moduleMap = data.modules.reduce<ModuleMap>(
      (acc, curr) => {
        acc.set(curr.id, curr)

        return acc
      },
      new Map<UID, ModuleType>(),
    )
    this.visibleModuleMap = new Map()
    this.id = data.id
    this.events = events
    this.action = new Action()
    this.container = container
    this.viewport = new Viewport(this)
    this.selectionManager = new SelectionManager(this)
    this.history = new History(this)

    // this.action.dispatch('editor-initialized')
    this.init()
  }

  private init() {
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
      this.updateVisibleModuleMap(this.viewport.getWorldRect())
      this.action.dispatch({type: 'visible-module-update', data: this.getVisibleModuleMap()})
    })

    /*this.action.on('world-shift', (worldRect) => {
      this.updateVisibleModuleMap(worldRect as BoundingRect)
    })*/
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

  render() {
  }

  //eslint-disable-block
  destroy() {
    // this.removeEventListeners()
    // this.panableContainer.destroy()
    this.action.destroy()
    this.selectionManager.destroy()
    this.history.destroy()
    this.viewport.destroy()
    this.moduleMap.clear()
  }

}

export default Editor
