import drawGrid from "./Grid.ts";
import flatData from "../core/flatten.ts";
import {calcNodeSelfSize, calculateBoundingRect} from "../core/measureNodes.ts";

export interface RendererProps {
  canvas: HTMLCanvasElement
  theme: ThemeShape
  dpr: DPR
  zoom: ZoomRatio
  logicResolution: Resolution
  physicalResolution: Resolution
}

class Renderer {
  private readonly dpr: DPR;
  private readonly zoom: ZoomRatio;
  private readonly logicResolution: Resolution;
  private readonly physicalResolution: Resolution;
  private readonly canvas: HTMLCanvasElement;
  private readonly canvas_ctx: CanvasRenderingContext2D;
  private readonly theme: ThemeShape;

  constructor({canvas, theme, physicalResolution, logicResolution, dpr = 1, zoom = 1}: RendererProps) {
    this.canvas = canvas
    this.canvas_ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.theme = theme
    this.physicalResolution = physicalResolution
    this.logicResolution = logicResolution
    this.dpr = dpr
    this.zoom = zoom
    this.initialData = null
    canvas.width = physicalResolution.width
    canvas.height = physicalResolution.height
  }

  render(data: string): void {
    const {canvas_ctx: ctx, theme: currentTheme} = this
    const {width, height} = this.physicalResolution

    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'red'
    ctx.font = '36px sans-serif';

    const PARSED_JSON = JSON.parse(data)
    const flattenedTree: FlattenedTreeNodeMap = flatData(PARSED_JSON)
    const nodesSelfRect = calcNodeSelfSize(flattenedTree, ctx)
    const measuredData: MeasuredDataRecord = calculateBoundingRect(flattenedTree, ctx, currentTheme)

    console.log(flattenedTree)
    // Renderer.calcHeight(flattenData, ctx)

    drawGrid({
      ctx,
      width,
      height,
      gridSize: 50,
      lineWidth: currentTheme.grid.lineWidth,
      strokeStyle: currentTheme.grid.color
    })

    Object.values(measuredData).forEach(node => {
      const text = node.key === 'root' ? node.key : String(node.value)
      // const {width, height, x, y} = node.rect

      // CTX.strokeRect(x + 5, y + 5, width, height);

      // ctx.fillText(text, x, y);
    });
  }
}

export default Renderer


