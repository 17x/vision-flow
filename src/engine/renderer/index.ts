import drawGrid from "./Grid.ts";
import flatData from "../core/flatten.ts";
import calcSizeByTheme from "../core/calcSizeByTheme.ts";

export interface RendererProps {
  canvas: HTMLCanvasElement
  theme: ThemeShape
  logicResolution: Resolution
  physicalResolution: Resolution
}

class Renderer {
  private readonly logicResolution: Resolution;
  private readonly physicalResolution: Resolution;
  private readonly canvas: HTMLCanvasElement;
  private readonly canvas_ctx: CanvasRenderingContext2D;
  private readonly theme: ThemeShape;

  constructor({canvas, theme, physicalResolution, logicResolution}: RendererProps) {
    this.canvas = canvas
    this.canvas_ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.theme = theme
    this.physicalResolution = physicalResolution
    this.logicResolution = logicResolution

    canvas.width = physicalResolution.width
    canvas.height = physicalResolution.height
  }

  static calcHeight(data: FlattenDataRecord, ctx: CanvasRenderingContext2D): SizedDataBase {
    /*if(node.children.length > 1) {

    }*/
    const calculated: { [key: FlattenDataBase["id"]]: true } = {}
    const max = Object.values(data).length
    let _i = 0

    const calc = (node: FlattenDataBase) => {
      return node.children.map(child => {
        console.log(child)

        selfSize
      })
    }

    while (true) {
      // calc(data['root'])

      if (++_i === max) {
        break
      }
    }

    Object.values(data).forEach((node: FlattenDataBase) => {

      // console.log(node)
    })

    // Renderer.calcHeight()
  }

  /**
   * Calculates the width and height of each node in the flatten data record
   * decoupled from the data flattening process
   * @param data - The FlattenDataRecord containing flattened JSON nodes to calculate sizes for.
   * @param ctx - The CanvasRenderingContext2D used to measure sizes.
   * @param theme - The theme used to calculate rects
   * @returns SizedDataRecord - The updated data record with calculated size information.
   */

  render(data: string): void {
    const {canvas_ctx: ctx, theme: currentTheme} = this
    const {width, height} = this.physicalResolution

    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'red'
    ctx.font = '36px sans-serif';

    const PARSED_JSON = JSON.parse(data)
    const flattenData: FlattenDataRecord = flatData(PARSED_JSON)
    const sizedData: SizedDataRecord = calcSizeByTheme(flattenData, ctx, currentTheme)

    console.log(sizedData)
    Renderer.calcHeight(flattenData, ctx)

    drawGrid({
      ctx,
      width,
      height,
      gridSize: 50,
      lineWidth: currentTheme.grid.lineWidth,
      strokeStyle: currentTheme.grid.color
    })

    /* Object.values(sizedData).forEach(node => {
       const text = node.key === 'root' ? node.key : String(node.value)
       const {width, height, x, y} = node.rect

       // CTX.strokeRect(x + 5, y + 5, width, height);

       ctx.fillText(text, x, y);
     });*/
  }
}

export default Renderer


