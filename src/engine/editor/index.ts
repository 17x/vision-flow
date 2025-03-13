import uid from "../../utilities/Uid.ts";
import generatorModuleByType from "./generator.ts";
import render from "../core/renderer.ts";
import SelectionManager from "./selectionManager.ts";
import CrossLine from "./crossLine.ts";
import {BasicEditorAreaSize, ManipulationTypes, ModifyModuleMap} from "./editor";
import PanableContainer from "./panableContainer";
import Shortcut from "./shortcut.ts";
import History from "./history/history.ts";
import {ModuleProps} from "../core/modules/modules";
import Rectangle from "../core/modules/shapes/rectangle.ts";
import deepClone from "../../utilities/deepClone.ts";
import typeCheck from "../../utilities/typeCheck.ts";
import TypeCheck from "../../utilities/typeCheck.ts";

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
  readonly modules: Map<UID, Modules>;
  readonly canvas: HTMLCanvasElement;
  readonly id: UID;
  readonly size: Size;
  // readonly logicResolution: Resolution;
  // readonly physicalResolution: Resolution;
  readonly dpr: DPR;
  readonly container: HTMLDivElement;
  readonly shortcut: Shortcut;
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
    this.modules = data.modules.reduce((previousValue, currentValue) => {
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
    this.selectionManager = new SelectionManager(this);
    this.crossLine = new CrossLine(this);
    this.history = new History(this);
    this.render()

    window['editor'] = this
  }

  createModuleId(): UID {
    return this.id + '-' + (++this.moduleCounter)
  }

  batchCreate() {
  }

  batchAdd(modules: Map<UID, Modules>, historyCode?: ManipulationTypes) {
    modules.forEach(mod => {
      this.modules.set(mod.id, mod);
    })

    if (historyCode) {
      this.history.replaceNext({
        type: historyCode,
        modules,
        selectedItems: []
      })
    }
  }

  batchCopy(from: 'all' | Set<UID>, removeId = false, addOn?: { string: unknown }): ModuleProps[] {
    const result: ModuleProps[] = []
    let modulesMap = new Map<UID, ModuleProps>();

    if (from === 'all') {
      modulesMap = this.modules
    } else if (typeCheck(from) === 'set') {
      from.forEach(id => {
        this.modules.forEach(mod => {
          if (mod.id === id) {
            modulesMap.set(id, mod)
          }
        })
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

  addModules(modulesData: ModuleProps[], historyCode?: ManipulationTypes): Modules[] {
    const newModules = deepClone(modulesData)
      .map((data) => {
        if (!data.id) {
          data.id = this.createModuleId()
        }
        const newModule = new Rectangle(data)
        this.modules.set(newModule.id, newModule)

        return newModule
      })

    if (historyCode) {
      this.history.replaceNext({
        type: historyCode,
        modules: newModules,
        selectedItems: []
      })
    }

    this.render()

    return newModules
  }

  removeModules(modulesData: ModuleProps[] | 'all', historyCode?: ManipulationTypes) {
    if (!modulesData) return

    if (modulesData === 'all') {
      const backup = this.modules
      this.modules.length = 0

      if (historyCode) {
        this.history.replaceNext({
          type: historyCode,
          modules: backup.map(module => module.getDetails()) as ModuleProps[],
          selectedItems: []
        })
      }

    } else {
      modulesData.forEach((item) => {
        const len = this.modules.length

        for (let i = 0; i < len; i++) {
          const module = this.modules[i];
          // console.log(i)
          if (module.id === item.id) {
            this.modules.splice(i, 1);
            --i
            break
          }
        }
      })

      if (historyCode) {
        this.history.replaceNext({
          type: historyCode,
          modules: modulesData,
          selectedItems: []
        })
      }
    }

    this.render()
  }

  modifyModules(modifyMap: ModifyModuleMap, historyCode?: ManipulationTypes) {
    [...modifyMap.keys()].map(id => {
      // console.log(id)
      this.modules.map(module => {
        if (module.id === id) {
          const modifyData: Partial<ModuleProps> = modifyMap.get(id)

          for (const modifyDataKey in modifyData) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            module[modifyDataKey] = modifyData[modifyDataKey]
          }
        }
      })
      // this.modules[id]
    })

    if (historyCode) {
      this.history.replaceNext({
        type: historyCode,
        modules: backup.map(module => module.getDetails()) as ModuleProps[],
        selectedItems: []
      })
    }

    this.render()
  }

  batchDelete(from: 'all' | Set<UID>, historyCode?: ManipulationTypes) {
    let backup: ModuleProps[] = []

    if (from === 'all') {
      backup = this.batchCopy('all')
      this.modules.clear()
    } else if (typeCheck(from) === 'set') {
      backup = this.batchCopy(from)
      backup.forEach(id => {
        this.modules.delete(id)
      })
    }

    if (historyCode) {
      this.history.replaceNext({
        type: historyCode,
        modules: backup,
        selectedItems: []
      })
    }

    this.render()
    return backup
  }

  batchModify(from: 'all' | Set<UID, Modules>, data: Partial<ModuleProps>, historyCode?: ManipulationTypes) {
    this.modules.forEach(module => {
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
  }

  render() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    const animate = () => {
      // console.time();
      render({
        ctx: this.ctx, modules: this.modules,
      });
      // requestAnimationFrame(animate);
      // console.timeEnd();
    }

    requestAnimationFrame(animate);
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


  /*
    render(data: string): void {
      const {canvas_ctx: ctx, /!*theme: currentTheme*!/} = this
      const {width, height} = this.physicalResolution

      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'
      ctx.fillStyle = 'red'
      ctx.font = '36px sans-serif';

      // const PARSED_JSON = JSON.parse(data)
      // const flattenedTree: FlattenedTreeNodeMap = flatData(PARSED_JSON)
      // const nodesSelfRect = calcNodeSelfSize(flattenedTree, ctx)
      // const measuredData: MeasuredDataRecord = calculateBoundingRect(flattenedTree, ctx, currentTheme)

      // console.log(flattenedTree)
      // Renderer.calcHeight(flattenData, ctx)

      /!*    drawGrid({
            ctx,
            width,
            height,
            gridSize: 50,
            lineWidth: currentTheme.grid.lineWidth,
            strokeStyle: currentTheme.grid.color
          })*!/
      /!*
          Object.values(measuredData).forEach(node => {
            const text = node.key === 'root' ? node.key : String(node.value)
            // const {width, height, x, y} = node.rect

            // CTX.strokeRect(x + 5, y + 5, width, height);

            // ctx.fillText(text, x, y);
          });*!/
    }

    private initialize() {
      // Selection box
      //    box and rotate
      // axis lines
      // align lines
      // side panel
    }*/
}

export default Editor;
