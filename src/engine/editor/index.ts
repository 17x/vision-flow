import uid from "../../utilities/Uid.ts";
import generatorModuleByType from "./generator.ts";
import render from "../core/renderer.ts";
import SelectionManager from "./selectionManager.ts";
import CrossLine from "./CrossLine.ts";
import {BasicEditorAreaSize} from "./editor";

export interface EditorDataProps {
  id: UID
  size: Size
  modules: ModuleTypeMap[keyof ModuleTypeMap][]
}

export const basicEditorAreaSize: BasicEditorAreaSize = {
  width: 1000,
  height: 1000
}

export interface EditorProps {
  // canvas: HTMLCanvasElement
  container: HTMLDivElement
  data: EditorDataProps
  // theme: ThemeShape
  dpr?: DPR
  zoom?: ZoomRatio
  logicResolution?: Resolution
  physicalResolution?: Resolution
}

class Editor {
  readonly modules: EditorDataProps["modules"];
  readonly canvas: HTMLCanvasElement;
  readonly id: UID;
  readonly size: Size;
  // readonly logicResolution: Resolution;
  // readonly physicalResolution: Resolution;
  readonly dpr: DPR;
  private readonly container: HTMLDivElement;
  private readonly wrapper: HTMLDivElement;
  private readonly zoom: ZoomRatio;
  private readonly canvas_ctx: CanvasRenderingContext2D;
  private readonly selectionManager: SelectionManager
  private readonly crossLine: CrossLine

  constructor({container, data, dpr = 4, zoom = 1}: EditorProps) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const wrapper = document.createElement("div");

    // this.theme = theme
    this.canvas = canvas
    this.canvas_ctx = ctx as CanvasRenderingContext2D
    // this.physicalResolution = physicalResolution
    // this.logicResolution = {width: logicResolution.width * dpr, height: logicResolution.height * dpr};
    this.dpr = dpr
    this.zoom = zoom
    this.modules = data.modules
    this.id = data.id;
    this.size = data.size;

    canvas.width = data.size.width
    canvas.height = data.size.height
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';

    container.innerHTML = ''
    container.setAttribute('editor-container', '')
    container.dataset['name'] = 'editor-container-' + this.id
    wrapper.append(canvas)
    container.append(wrapper)

    render({
      ctx: this.canvas_ctx,
      modules: this.modules,
    })

    this.selectionManager = new SelectionManager(this)
    this.crossLine = new CrossLine(this)
  }

  static createInstance(container: HTMLDivElement): Editor {
    const newUID = uid()

    return new Editor({
      container,
      data: {
        id: newUID,
        size: basicEditorAreaSize,
        modules: [
          generatorModuleByType('1', 'rectangle')
        ]
      }
    })
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

export default Editor