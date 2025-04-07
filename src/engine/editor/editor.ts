import SelectionManager from './selection/selectionManager.ts'
import {BasicEditorAreaSize, ActionCode, EventHandlers} from './type'
import History from './history/history.ts'
import Rectangle from '../core/modules/shapes/rectangle.ts'
import deepClone from '../../utilities/deepClone.ts'
import typeCheck from '../../utilities/typeCheck.ts'
import TypeCheck from '../../utilities/typeCheck.ts'
import Action from './actions'
import Connector from '../core/modules/connectors/connector.ts'
import {HistoryOperationType} from './history/type'
import batchReplaceModules from './helpers/batchReplaceModules.ts'
import Viewport from './viewport/viewport.ts'

import {rectsOverlap} from '../core/utils.ts'

// import {isInsideRect} from "./viewport/helper.ts";

export interface EditorDataProps {
  id: UID;
  // size: Size;
  modules: ModuleType[];
}

export const basicEditorAreaSize: BasicEditorAreaSize = {
  width: 1000, height: 1000,
}

export interface EditorProps {
  container: HTMLDivElement;
  data: EditorDataProps;
  // theme: ThemeShape
  dpr?: DPR;
  zoom?: ZoomRatio;
  logicResolution?: Resolution;
  physicalResolution?: Resolution;
  events?: EventHandlers
}

class Editor {
  private moduleCounter = 0
  moduleMap: ModuleMap
  visibleModuleMap: ModuleMap
  private id: UID
  // private size: Size;
  container: HTMLDivElement
  events: EventHandlers = {}
  private action: Action
  history: History
  // public panableContainer: PanableContainer
  selectionManager: SelectionManager
  // private wrapper: HTMLDivElement
  viewport: Viewport
  // @ts-expect-error
  private zoom: ZoomRatio
  // private ctx: CanvasRenderingContext2D
  scale: number = 1
  // private minScale: number = 0.5
  // private maxScale: number = 10
  // private zoomSpeed: number = 0.1

  constructor({
                container, data, dpr = 2, events = {},
              }: EditorProps) {
    this.moduleMap = data.modules.reduce<ModuleMap>(
      (previousValue, currentValue) => {
        previousValue.set(currentValue.id, currentValue)

        return previousValue
      },
      new Map<UID, ModuleType>(),
    )
    this.visibleModuleMap = new Map()
    this.id = data.id
    // this.size = data.size;
    // this.wrapper = wrapper
    this.scale = dpr
    this.events = events
    // const canvas = document.createElement("canvas")
    // const ctx = canvas.getContext("2d")
    // const wrapper = document.createElement("div")

    this.container = container

    this.viewport = new Viewport(this)
    this.action = new Action(this)
    this.selectionManager = new SelectionManager(this)
    this.history = new History(this)
    // this.render()
  }

  private createModuleId(): UID {
    return this.id + '-' + (++this.moduleCounter)
  }

  batchCreate(moduleDataList: ModuleProps[]): ModuleMap {
    const clonedData = deepClone(moduleDataList) as ModuleProps[]
    const newMap: ModuleMap = new Map()
    const create = (data: ModuleProps) => {
      if (!data.id) {
        data.id = this.createModuleId()
      }

      if (data.type === 'rectangle') {
        return new Rectangle(data)
      }
      if (data.type === 'connector') {
        return new Connector(data)
      }
    }

    clonedData.forEach(data => {
      const module = create.call(this, data)

      newMap.set(data.id, module as ModuleType)
    })

    return newMap
  }

  batchAdd(modules: ModuleMap, historyCode?: Extract<HistoryOperationType, 'add' | 'paste' | 'duplicate'>) {
    modules.forEach(mod => {
      this.moduleMap.set(mod.id, mod)
    })

    this.updateVisibleModuleMap(this.viewport.virtualRect)
    this.events.onModulesUpdated?.(this.moduleMap)

    this.render()

    if (historyCode) {
      const moduleProps = [...modules.values()].map(mod => mod.getDetails())
      this.selectionManager.getSelected()

      this.history.add({
          type: historyCode,
          payload: {
            modules: moduleProps,
            selectedModules: this.selectionManager.getSelected(),
          },
        },
      )
    }
  }

  batchCopy(from: 'all' | Set<UID>, removeId = false, addOn?: { string: unknown }): ModuleProps[] {
    const result: ModuleProps[] = []
    let modulesMap: ModuleMap = new Map()

    if (from === 'all') {
      modulesMap = this.moduleMap
    } else if (typeCheck(from) === 'set') {
      from.forEach(id => {
        const mod = this.moduleMap.get(id)
        if (mod) {
          modulesMap.set(id, mod)
        }
      })
    }

    modulesMap.forEach(mod => {
      const data: ModuleProps = mod.getDetails()

      if (removeId) {
        delete data.id
      }

      if (TypeCheck(addOn) === 'object') {
        Object.assign(data, addOn)
      }

      result.push(data)
    })

    return result
  }

  batchDelete(from: 'all' | Set<UID>, historyCode?: Extract<HistoryOperationType, 'delete'>) {
    let backup: ModuleProps[] = []

    if (from === 'all') {
      backup = this.batchCopy('all')
      this.moduleMap.clear()
    } else if (typeCheck(from) === 'set') {
      backup = this.batchCopy(from)
      backup.forEach(module => {
        this.moduleMap.delete(module.id)
      })
    }

    if (historyCode) {
      this.history.add({
        type: 'delete',
        payload: {
          modules: backup,
          selectedModules: this.selectionManager.getSelected(),
        },
      })
    }

    this.updateVisibleModuleMap(this.viewport.virtualRect)
    this.render()
    this.events.onModulesUpdated?.(this.moduleMap)

    return backup
  }

  batchMove(from: 'all' | Set<UID>, delta: Point, historyCode?: Extract<HistoryOperationType, 'move'>) {
    let modulesMap: ModuleMap | null = null

    if (from === 'all') {
      modulesMap = this.moduleMap
    } else if (typeCheck(from) === 'set') {
      modulesMap = this.getModulesByIdSet(from)
    } else {
      return false
    }

    modulesMap.forEach((module: ModuleProps) => {
      module.x += delta.x
      module.y += delta.y
    })

    this.render()
    this.events.onModulesUpdated?.(this.moduleMap)
    this.events.onSelectionUpdated?.(this.selectionManager.selectedModules, this.selectionManager.getIfUnique())

    if (historyCode) {
      this.history.add({
        type: 'move',
        payload: {
          delta,
          selectedModules: from,
        },

      })
    }
  }

  batchModify(from: 'all' | Set<UID>, data: Partial<ModuleProps>, historyCode?: HistoryOperationType) {
    let modulesMap = null

    if (from === 'all') {
      modulesMap = this.moduleMap
    } else if (typeCheck(from) === 'set') {
      modulesMap = this.getModulesByIdSet(from)
    } else {
      return false
    }

    modulesMap.forEach((module: ModuleProps) => {
      Object.keys(data).forEach((key) => {
        const value = data[key]

        if (typeof value === 'string' || typeof value === 'number') {
          module[key] = value
        }
      })
    })

    // this.selectionManager.render()
    this.render()
    this.events.onModulesUpdated?.(this.moduleMap)
    this.events.onSelectionUpdated?.(this.selectionManager.selectedModules, this.selectionManager.getIfUnique())

    if (historyCode) {
      /*this.history.add({
        type: 'modify',
        payload: {
          changes:{},
          selectedModules: this.selectionManager.getSelected(),
        },
      })*/
    }
  }

  batchReplaceModules(moduleList: ModuleProps[]) {
    batchReplaceModules.bind(this, moduleList)
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

  updateVisibleModuleMap(virtualRect: BoundingRect) {
    this.visibleModuleMap.clear()

    this.moduleMap.forEach((module) => {
      const boundingRect = module.getBoundingRect() as BoundingRect

      if (rectsOverlap(boundingRect, virtualRect)) {
        this.visibleModuleMap.set(module.id, module)
      }
    })
  }

  public execute(code: ActionCode, data: unknown = null) {
    this.action.dispatcher(code, data)
  }

  render() {
    this.viewport.render()
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
    // @ts-ignore
    // this.panableContainer = null
    // @ts-ignore
    this.action = null
    // @ts-ignore
    this.selectionManager = null
    // @ts-ignore
    this.crossLine = null
    // @ts-ignore
    this.history = null
    // @ts-ignore
    this.moduleMap = null
    // @ts-ignore
    this.canvas = null
    // @ts-ignore
    this.ctx = null
    // @ts-ignore
    this.zoom = null
    // @ts-ignore
    this.id = null
    // @ts-ignore
    this.events = null
    // @ts-ignore
    this.container = null
  }

}

export default Editor
