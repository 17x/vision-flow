import typeCheck from "../../utilities/typeCheck.ts";
import drawGrid from "./Grid.ts";
import theme from "../../theme";

export interface RendererProps {
  canvas: HTMLCanvasElement
  theme: ThemeShape
  logicResolution: Resolution
  physicalResolution: Resolution
}

type FlattenDataBase = {
  id: number
  value: JSONPrimitiveValue
  type: JSONStandardType
  parentId?: number,
  children: number[]
}
type FlattenDataRecord = Record<number, FlattenDataBase>
type SizedDataBase = { selfSize: SizeBase, WholeSize: SizeBase } & FlattenDataBase;
type SizedDataRecord = Record<number, SizedDataBase>

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

  static convertJsonToFlattenRendererData(input: JSONValue): FlattenDataRecord {
    const result: FlattenDataRecord = {};
    let idCounter = 0;

    const traverse = (id: number, value: JSONValue, parentId?: number): FlattenDataBase => {
      const nodeType = typeCheck(value);
      const isComplexType = nodeType === 'object' || nodeType === 'array';

      const node: FlattenDataBase = {
        id,
        value: isComplexType ? null : value as JSONPrimitiveValue,
        type: nodeType,
        parentId,
        children: []
      }
      result[id] = node

      if (nodeType === 'object' && value !== null) {
        Object.entries(value as JSONObject).forEach(([, childValue]) => {
          const newId = ++idCounter

          traverse(newId, childValue, id);

          node.children.push(newId);
        });
      } else if (nodeType === 'array') {
        (value as JSONArray).forEach((childValue) => {
          const newId = ++idCounter
          traverse(newId, childValue, id);
          node.children.push(newId);
        });
      }

      return node;
    };

    traverse(0, input);

    return result;
  }

  static calcHeight(data: FlattenDataRecord, ctx: CanvasRenderingContext2D): SizedDataBase {
    /*if(node.children.length > 1) {

    }*/
    const calculated: { [key: FlattenDataBase["id"]]: true } = {}
    const max = Object.values(data).length
    let _i = 0
    console.log(data)
    const calc = (node: FlattenDataBase) => {
      return node.children.map(child => {
        console.log(child)

        selfSize
      })
    }

    while (true) {
      calc(data['root'])

      if (++_i === max) {
        break
      }
    }

    Object.values(data).forEach((node: FlattenDataBase) => {

      console.log(node)
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
  static calcSizeByTheme(data: FlattenDataRecord, ctx: CanvasRenderingContext2D, theme: ThemeShape): SizedDataRecord {
    const newRecord: SizedDataRecord = {}

    ctx.save()
    ctx.font = theme.typography.fontSize + 'px mono sans-serif'

    for (const dataKey in data) {
      const node = data[dataKey];
      const isComplexType = node.type === 'object' || node.type === 'array';
      const metrics = ctx.measureText(isComplexType ? node.type : String(node.value));
      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const parentId: number = node.parentId ?? -1;
      let x = 0
      let y = 0

      // root
      if (parentId > 0) {
        const parentNode: SizedDataBase = newRecord[parentId]

        x = parentNode.selfSize.x + parentNode.selfSize.width
        y = parentNode.selfSize.y + parentNode.selfSize.height / 2
      }

      newRecord[dataKey] = {
        ...node,
        selfSize: {
          x,
          y,
          width,
          height,
        }
      }
    }

    ctx.restore()

    return newRecord
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
    const flattenData: FlattenDataRecord = Renderer.convertJsonToFlattenRendererData(PARSED_JSON)
    // const sizedData: SizedDataRecord = Renderer.calcSizeByTheme(flattenData, ctx, currentTheme)

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


