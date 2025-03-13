import render from "../core/renderer.ts";
import SelectionManager from "./selectionManager.ts";
import CrossLine from "./crossLine.ts";
import {BasicEditorAreaSize, ActionTypeType} from "./editor";
import PanableContainer from "./panableContainer";
import Shortcut from "./shortcut.ts";
import History from "./history/history.ts";
import Rectangle from "../core/modules/shapes/rectangle.ts";
import deepClone from "../../utilities/deepClone.ts";
import typeCheck from "../../utilities/typeCheck.ts";
import TypeCheck from "../../utilities/typeCheck.ts";
import Action, {doIt} from "./actions";

export interface EditorDataProps {
  id: UID;
  size: Size;
  modules: Modules[];
}

export const basicEditorAreaSize: BasicEditorAreaSize = {
  width: 1000, height: 1000,
};

export interface EditorProps {
  // canvas: HTMLCanvasElement
  container: HTMLDivElement;
  data: EditorDataProps;
  // theme: ThemeShape
  dpr?: DPR;
  zoom?: ZoomRatio;
  logicResolution?: Resolution;
  physicalResolution?: Resolution;
}

class Editor {
  moduleCounter = 0
  readonly moduleMap: Map<UID, Modules>;
  readonly canvas: HTMLCanvasElement;
  readonly id: UID;
  readonly size: Size;
  readonly dpr: DPR;
  readonly container: HTMLDivElement;
  readonly shortcut: Shortcut;
  readonly action: Action;
  readonly history: History;
  readonly panableContainer: PanableContainer;
  readonly selectionManager: SelectionManager;
  private readonly wrapper: HTMLDivElement;
  private readonly zoom: ZoomRatio;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly crossLine: CrossLine;
  scale: number = 1;
  private minScale: number = 0.5;
  private maxScale: number = 10;
  private zoomSpeed: number = 0.1;

  constructor({
                container, data, dpr = 2, zoom = 1,
              }: EditorProps) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const wrapper = document.createElement("div");

    this.container = container;
    this.canvas = canvas;
    this.ctx = ctx as CanvasRenderingContext2D;
    this.dpr = dpr;
    this.zoom = zoom;
    this.moduleMap = data.modules.reduce((previousValue, currentValue) => {
      previousValue.set(currentValue.id, currentValue)

      return previousValue
    }, new Map<UID, Modules>());
    this.id = data.id;
    this.size = data.size;
    this.wrapper = wrapper;
    this.scale = dpr

    canvas.style.width = window.outerWidth + 'px';
    canvas.style.height = window.outerHeight + 'px';
    canvas.width = window.outerWidth * dpr;
    canvas.height = window.outerHeight * dpr;

    // ctx!.scale(dpr, dpr);

    container.innerHTML = "";
    container.style.overflow = "hidden";
    container.style.position = "relative";
    container.style.display = "flex";
    container.style.height = "100%";
    container.style.width = "100%";
    container.setAttribute("editor-container", "");

    wrapper.append(canvas);
    container.append(wrapper);
    this.setupEventListeners()
    this.panableContainer = new PanableContainer({
      element: wrapper, onPan: (deltaX, deltaY) => {

      },
    });
    this.shortcut = new Shortcut(this)
    this.action = new Action(this)
    this.selectionManager = new SelectionManager(this);
    this.crossLine = new CrossLine(this);
    this.history = new History(this);
    this.render()

    window['editor'] = this
  }

  private init() {

  }

  createModuleId(): UID {
    return this.id + '-' + (++this.moduleCounter)
  }

  batchCreate(moduleDataList: ModuleProps[]) {
    const newMap = new Map<UID, Modules>();

    deepClone(moduleDataList).forEach(data => {
      if (!data.id) {
        data.id = this.createModuleId()
      }

      if (data.type === 'rectangle') {
        newMap.set(data.id, new Rectangle(data));
      }
    })

    return newMap;
  }

  batchAdd(modules: Map<UID, Modules>, historyCode?: ActionTypeType) {
    modules.forEach(mod => {
      this.moduleMap.set(mod.id, mod);
    })

    if (historyCode) {
      this.history.replaceNext({
        type: historyCode,
        modules
      })
    }

    this.render()
  }

  batchCopy(from: 'all' | Set<UID>, removeId = false, addOn?: { string: unknown }): ModuleProps[] {
    const result: ModuleProps[] = []
    let modulesMap = new Map<UID, ModuleProps>();

    if (from === 'all') {
      modulesMap = this.moduleMap
    } else if (typeCheck(from) === 'set') {
      from.forEach(id => {
        const mod = this.moduleMap.get(id);
        if (mod) {
          modulesMap.set(id, mod);
        }
      })
    }

    modulesMap.forEach(mod => {
      const data = mod.getDetails()

      if (removeId) {
        delete data.id
      }

      if (TypeCheck(addOn) === 'object') {
        Object.assign(data, addOn)
      }

      result.push(data);
    })

    return result
  }

  batchDelete(from: 'all' | Set<UID>, historyCode?: ActionTypeType) {
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
      this.history.replaceNext({
        type: historyCode,
        modules: backup
      })
    }

    this.render()
    return backup
  }

  batchModify(from: 'all' | Set<UID>, data: Partial<ModuleProps>, historyCode?: ActionTypeType) {
    let modulesMap = null;

    if (from === 'all') {
      modulesMap = this.moduleMap
    } else if (typeCheck(from) === 'set') {
      modulesMap = this.getModulesByIdSet(from)
    } else {
      return false
    }

    modulesMap.forEach(module => {
      Object.keys(data).forEach((key) => {
        const value = data[key]

        if (typeof value === 'string') {
          module[key] = value
        } else if (typeof value === 'number') {
          module[key] += data[key]
        }
      })
    })

    this.render()

    if (historyCode) {

    }
  }

  getModulesByIdSet(idSet: Set<UID>): Map<UID, Modules> {
    const result: Map<UID, Modules> = new Map()

    idSet.forEach(id => {
      const mod = this.moduleMap.get(id);
      if (mod) {
        result.set(id, mod);
      }
    })

    return result
  }

  private setupEventListeners() {
    window.addEventListener("wheel", (event) => this.handleWheelZoom(event), {passive: false});
    window.addEventListener("keydown", (event) => this.handleKeyboardZoom(event));
    this.canvas.addEventListener("gesturestart", (event) => event.preventDefault());
    this.canvas.addEventListener("gesturechange", (event) => this.handleTouchpadZoom(event as unknown));
    this.canvas.addEventListener("touchstart", (event) => {
      // console.log(event, 'touchmove');
    }, {passive: true});
  }

  private handleWheelZoom(event: WheelEvent) {
    // console.log('wheel',event.deltaX, event.deltaY);
    // console.log(event);
    if (event.altKey) {
      const zoomFactor = event.deltaY < 0 ? 1 + this.zoomSpeed : 1 - this.zoomSpeed;
      event.preventDefault();
      this.applyZoom(zoomFactor);
    }
  }

  private handleKeyboardZoom(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.metaKey) return;

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
      this.applyZoom(r);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private handleTouchpadZoom(event: unknown) {
    console.log(9)
    event.preventDefault();
    const zoomFactor = event.scale > 1 ? 1 + this.zoomSpeed : 1 - this.zoomSpeed;
    this.applyZoom(zoomFactor);
  }

  private applyZoom(factor: number) {
    const newScale = this.scale * factor;

    if (newScale < this.minScale || newScale > this.maxScale) return;

    this.scale = newScale;
    this.render();
    this.selectionManager.render()
  }

  render() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    const animate = () => {
      // console.time();
      render({
        ctx: this.ctx, modules: this.moduleMap,
      });
      // requestAnimationFrame(animate);
      // console.timeEnd();
    }

    requestAnimationFrame(animate);
  }
}

export default Editor;
