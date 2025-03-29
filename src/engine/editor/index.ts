import render from "../core/renderer/renderer.ts"
import SelectionManager from "./selection/selectionManager.ts"
import CrossLine from "./crossLine.ts"
import {BasicEditorAreaSize, ActionCode, MoveDirection} from "./editor"
import PanableContainer from "./panableContainer"
// import Shortcut from "./shortcut.ts";
import History from "./history/history.ts"
import Rectangle from "../core/modules/shapes/rectangle.ts"
import deepClone from "../../utilities/deepClone.ts"
import typeCheck from "../../utilities/typeCheck.ts"
import TypeCheck from "../../utilities/typeCheck.ts"
import Action from "./actions"
import {EventHandlers} from "./events"
import Connector from "../core/modules/connectors/connector.ts"
import {HistoryActionType} from "./history/type"

export interface EditorDataProps {
  id: UID;
  // size: Size;
  modules: ModuleType[];
}

export const basicEditorAreaSize: BasicEditorAreaSize = {
  width: 1000, height: 1000,
}

export interface EditorProps {
  // canvas: HTMLCanvasElement
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
  canvas: HTMLCanvasElement
  private id: UID
  // private size: Size;
  dpr: DPR
  private container: HTMLDivElement
  events: EventHandlers = {}
  private action: Action
  private history: History
  public panableContainer: PanableContainer
  selectionManager: SelectionManager
  private wrapper: HTMLDivElement

  // @ts-expect-error
  private zoom: ZoomRatio
  private crossLine: CrossLine
  private ctx: CanvasRenderingContext2D
  scale: number = 1
  private minScale: number = 0.5
  private maxScale: number = 10
  private zoomSpeed: number = 0.1

  constructor({
                container, data, dpr = 2, zoom = 1, events = {}
              }: EditorProps) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const wrapper = document.createElement("div")

    this.container = container
    this.canvas = canvas
    this.ctx = ctx as CanvasRenderingContext2D
    this.dpr = dpr
    this.zoom = zoom
    this.moduleMap = data.modules.reduce<ModuleMap>(
      (previousValue, currentValue) => {
        previousValue.set(currentValue.id, currentValue)

        return previousValue
      },
      new Map<UID, ModuleType>()
    )
    this.id = data.id
    // this.size = data.size;
    this.wrapper = wrapper
    this.scale = dpr
    this.events = events

    canvas.style.width = window.outerWidth + 'px'
    canvas.style.height = window.outerHeight + 'px'
    canvas.width = window.outerWidth * dpr
    canvas.height = window.outerHeight * dpr

    // ctx!.scale(dpr, dpr);
    container.innerHTML = ""
    container.style.overflow = "hidden"
    container.style.position = "relative"
    container.style.display = "flex"
    container.style.height = "100%"
    container.style.width = "100%"
    container.setAttribute("editor-container", "")

    wrapper.append(canvas)
    container.append(wrapper)
    this.setupEventListeners()
    this.panableContainer = new PanableContainer({
      element: wrapper,
      onPan: (deltaX, deltaY) => {
        console.log(deltaX, deltaY)
      },
    })
    // this.shortcut = new Shortcut(this)
    this.action = new Action(this)
    this.selectionManager = new SelectionManager(this)
    this.crossLine = new CrossLine(this)
    this.history = new History(this)
    this.render()
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

  batchAdd(modules: ModuleMap, historyCode?: HistoryActionType) {
    modules.forEach(mod => {
      this.moduleMap.set(mod.id, mod)
    })

    if (historyCode) {
      // console.log([...modules.values()].map(mod => mod.getDetails()))
      const moduleProps = [...modules.values()].map(mod => mod.getDetails())
      this.history.add({
          type: historyCode,
          modules: moduleProps,
          selectModules: new Set(moduleProps.map(m => m.id))
        }
      )
    }

    this.events.onModulesUpdated?.(this.moduleMap)

    this.render()
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

  batchDelete(from: 'all' | Set<UID>, historyCode?: HistoryActionType) {
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
        type: historyCode,
        modules: backup,
        selectModules: this.selectionManager.getSelected()
      })
    }

    this.render()
    this.events.onModulesUpdated?.(this.moduleMap)
    return backup
  }

  batchModify(from: 'all' | Set<UID>, data: Partial<ModuleProps>, historyCode?: HistoryActionType) {
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
        const code = data['code'] as MoveDirection
        const value = data[key]

        if (code === 'moveUp') {
          module.y -= 1
        } else if (code === 'moveDown') {
          module.y += 1
        } else if (code === 'moveLeft') {
          module.x -= 1
        } else if (code === 'moveRight') {
          module.x += 1
        } else if (typeof value === 'string' || typeof value === 'number') {
          module[key] = value
        }
      })
    })

    this.render()
    this.events.onModulesUpdated?.(this.moduleMap)
    this.selectionManager.render()

    if (historyCode) {
      this.history.add({
        type: historyCode,
        modules: [...this.moduleMap.values()].map(mod => mod.getDetails()),
        selectModules: this.selectionManager.getSelected()
      })
    }
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

  private setupEventListeners() {
    window.addEventListener("wheel", (event) => this.handleWheelZoom(event), {passive: false})
    window.addEventListener("keydown", (event) => this.handleKeyboardZoom(event))
    this.canvas.addEventListener("gesturestart", (event) => event.preventDefault())
    // this.canvas.addEventListener("gesturechange", (event) => this.handleTouchpadZoom(event as unknown));
  }

  private removeEventListeners() {
    window.removeEventListener("wheel", (event) => this.handleWheelZoom(event))
    window.removeEventListener("keydown", (event) => this.handleKeyboardZoom(event))
    this.canvas.removeEventListener("gesturestart", (event) => event.preventDefault())
    // this.canvas.removeEventListener("gesturechange", (event) => this.handleTouchpadZoom(event as unknown));
  }

  private handleWheelZoom(event: WheelEvent) {
    // console.log('wheel',event.deltaX, event.deltaY);
    // console.log(event);
    if (event.altKey) {
      const zoomFactor = event.deltaY < 0 ? 1 + this.zoomSpeed : 1 - this.zoomSpeed
      event.preventDefault()
      this.applyZoom(zoomFactor)
    }
  }

  private handleKeyboardZoom(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.metaKey) return

    let r = this.scale

    if (event.key === "=" || event.key === "+") {
      r = r + this.zoomSpeed
    } else if (event.key === "-") {
      r = r - this.zoomSpeed
    } else if (event.key === "0") {
      r = this.dpr
    }

    // console.log(r)

    if (r !== this.scale) {
      this.applyZoom(r)
      event.preventDefault()
      event.stopPropagation()
    }
  }

  /*  private handleTouchpadZoom(event: unknown) {
      console.log(9)
      // event.preventDefault();
      const zoomFactor = event.scale > 1 ? 1 + this.zoomSpeed : 1 - this.zoomSpeed;
      this.applyZoom(zoomFactor);
    }*/

  private applyZoom(factor: number) {
    const newScale = this.scale * factor

    if (newScale < this.minScale || newScale > this.maxScale) return

    this.scale = newScale
    this.render()
    this.selectionManager.render()
  }

  public execute(code: ActionCode, data: unknown = null) {
    this.action.dispatcher(code, data)
  }

  render() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0)

    const animate = () => {
      // console.time();
      render({
        ctx: this.ctx, modules: this.moduleMap,
      })
      // requestAnimationFrame(animate);
      // console.timeEnd();
    }

    requestAnimationFrame(animate)
  }


  //eslint-disable-block
  destroy() {
    this.removeEventListeners()
    this.panableContainer.destroy()
    this.action.destroy()
    this.selectionManager.destroy()
    this.crossLine.destroy()
    this.history.destroy()
    this.moduleMap.clear()
    // @ts-ignore
    this.panableContainer = null
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
    this.dpr = null
    // @ts-ignore
    this.zoom = null
    // @ts-ignore
    this.id = null
    // @ts-ignore
    this.events = null
    this.container.removeChild(this.wrapper)
    this.container.innerHTML = ''
    // @ts-ignore
    this.container = null
  }


}

export default Editor
