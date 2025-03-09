import uid from "../../utilities/Uid.ts";
import generatorModuleByType from "./generator.ts";
import render from "../core/renderer.ts";
import SelectionManager from "./selectionManager.ts";
import CrossLine from "./crossLine.ts";
import {BasicEditorAreaSize, ManipulationTypes} from "./editor";
import PanableContainer from "./panableContainer";
import Shortcut from "./shortcut.ts";
import History from "./history/history.ts";
import {ModuleProps} from "../core/modules/modules";
import Rectangle from "../core/modules/shapes/rectangle.ts";
import deepClone from "../../utilities/deepClone.ts";

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
  modules: Modules[];
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
  private readonly canvas_ctx: CanvasRenderingContext2D;
  private readonly crossLine: CrossLine;

  constructor({
                container, data, dpr = 2, zoom = 1,
              }: EditorProps) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const wrapper = document.createElement("div");

    this.container = container;
    this.canvas = canvas;
    this.canvas_ctx = ctx as CanvasRenderingContext2D;
    this.dpr = dpr;
    this.zoom = zoom;
    this.modules = data.modules;
    this.id = data.id;
    this.size = data.size;
    this.wrapper = wrapper;

    // canvas.style.width = window.outerWidth + 'px';
    // canvas.style.height = window.outerHeight + 'px';
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
    console.log(this)
    this.panableContainer = new PanableContainer({
      element: wrapper, onPan: (deltaX, deltaY) => {

      },
    });
    this.shortcut = new Shortcut(this)
    this.selectionManager = new SelectionManager(this);
    this.crossLine = new CrossLine(this);
    this.history = new History(this);
    this.render()
  }

  createModuleId(): UID {
    return this.id + '-' + (++this.moduleCounter)
  }

  addModules(modulesData: ModuleProps[], historyCode?: ManipulationTypes): Modules[] {
    const newModulesData = deepClone(modulesData).map((data) => {
      if (!data.id) {
        data.id = this.createModuleId()
      }

      return data
    })

    const newModules = newModulesData.map((data) => {
      return new Rectangle(data)
    })

    // this.modules.push(...newModules);
    this.modules = this.modules.concat(newModules)

    if (historyCode) {
      this.history.replaceNext({
        type: historyCode,
        modules: newModulesData,
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


  render() {
    const animate = () => {
      // console.time();
      render({
        ctx: this.canvas_ctx, modules: this.modules,
      });
      // requestAnimationFrame(animate);
      // console.timeEnd();
    }

    requestAnimationFrame(animate);
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
