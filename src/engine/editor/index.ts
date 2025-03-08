import uid from "../../utilities/Uid.ts";
import generatorModuleByType from "./generator.ts";
import render from "../core/renderer.ts";
import SelectionManager from "./selectionManager.ts";
import CrossLine from "./crossLine.ts";
import {BasicEditorAreaSize} from "./editor";
import PanableContainer from "./panableContainer";
import Shortcut from "./shortcut.ts";

export interface EditorDataProps {
  id: UID;
  size: Size;
  modules: ModuleTypeMap[keyof ModuleTypeMap][];
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
  readonly modules: EditorDataProps["modules"];
  readonly canvas: HTMLCanvasElement;
  readonly id: UID;
  readonly size: Size;
  // readonly logicResolution: Resolution;
  // readonly physicalResolution: Resolution;
  readonly dpr: DPR;
  readonly container: HTMLDivElement;
  readonly shortcut: Shortcut;
  readonly panableContainer: PanableContainer;
  private readonly wrapper: HTMLDivElement;
  private readonly zoom: ZoomRatio;
  private readonly canvas_ctx: CanvasRenderingContext2D;
  private readonly selectionManager: SelectionManager;
  private readonly crossLine: CrossLine;

  constructor({container, data, dpr = 2, zoom = 1}: EditorProps) {
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

    // canvas.width = data.size.width
    // canvas.height = data.size.height
    canvas.width = window.outerWidth * dpr;
    canvas.height = window.outerHeight * dpr;
    container.innerHTML = "";
    container.style.overflow = "hidden";
    container.style.position = "relative";
    container.style.display = "flex";
    container.style.height = "100%";
    container.style.width = "100%";
    container.setAttribute("editor-container",
      "");

    wrapper.append(canvas);
    container.append(wrapper);

    this.shortcut = new Shortcut(this)
    this.selectionManager = new SelectionManager(this);
    this.crossLine = new CrossLine(this);
    this.panableContainer = new PanableContainer({
      element: wrapper, onPan: (deltaX, deltaY) => {
        // console.log(9);
        // console.log(deltaX, deltaY);
      },
    });
    this.render()
  }

  static createInstance(container: HTMLDivElement): Editor {
    const newUID = uid();

    return new Editor({
      container, data: {
        id: newUID,
        size: basicEditorAreaSize,
        modules: Array.from({length: 1000},
          (_, index) => {
            return generatorModuleByType(newUID + '-' + (index + 1),
              "rectangle",
              {
                x: (index + 1) * 10, y: (index + 1) * 10, width: 100, height: 100
              });
          }),
      },
    });
  }

  draw() {
    render({
      ctx: this.canvas_ctx, modules: this.modules,
    });
  }

  render() {
    const animate = () => {
      console.time();
      this.draw()
      // requestAnimationFrame(animate);
      console.timeEnd();
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
