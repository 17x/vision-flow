import typeCheck from "../../utilities/typeCheck.ts";

type RendererProps = {
  canvas: HTMLCanvasElement;
}

type FlattenDataBase = {
  id: number
  key: string
  value: JSONPrimitiveValue
  type: JSONStandardType
  parentId?: number,
  children: number[]
}
type FlattenDataRecord = Record<number, FlattenDataBase>
type SizedDataBase = { rect: RectSizeBase } & FlattenDataBase;
type SizedDataRecord = Record<number, SizedDataBase>

class Renderer {
  private readonly canvas_ctx: CanvasRenderingContext2D;

  constructor({canvas}: RendererProps) {
    this.canvas_ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // console.log(this.canvas_ctx)
  }

  static convertJsonToFlattenRendererData(input: JSONValue): FlattenDataRecord {
    const result: FlattenDataRecord = {};
    let idCounter = 0;

    const traverse = (key: string, value: JSONValue, parentId?: number): FlattenDataBase => {
      const nodeId = idCounter++;
      const nodeType = typeCheck(value);
      const isComplexType = nodeType === 'object' || nodeType === 'array';

      const node: FlattenDataBase = {
        id: nodeId,
        key,
        value: isComplexType ? null : value as JSONPrimitiveValue,
        type: nodeType,
        parentId,
        children: []
      }

      result[nodeId] = node

      if (nodeType === 'object' && value !== null) {
        Object.entries(value).forEach(([childKey, childValue]) => {
          const child = traverse(childKey, childValue, nodeId);
          node.children.push(child.id);
        });
      } else if (nodeType === 'array') {
        (value as JSONArray).forEach((childValue, index) => {
          const child = traverse(String(index), childValue, nodeId);
          node.children.push(child.id);
        });
      }

      return node;
    };

    traverse('root', input);

    return result;
  }

  /**
   * Calculates the width and height of each node in the flatten data record
   * using the provided CanvasRenderingContext2D. This function is designed to
   * be decoupled from the data flattening process, aligning with the principle of
   * separation of concerns. By detaching calculation from data flattening, we
   * achieve a more modular and maintainable system.
   *
   * @param data - The FlattenDataRecord containing flattened JSON nodes to calculate sizes for.
   * @param ctx - The CanvasRenderingContext2D used to measure text metrics.
   * @returns SizedDataRecord - The updated data record with calculated size information.
   */
  static calcSize(data: FlattenDataRecord, ctx: CanvasRenderingContext2D): SizedDataRecord {
    const newRecord: SizedDataRecord = {}

    ctx.font = '12px mono sans-serif'

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

        x = parentNode.rect.x + parentNode.rect.width
        y = parentNode.rect.y + parentNode.rect.height / 2
      }

      newRecord[dataKey] = {
        ...node,
        rect: {
          x,
          y,
          width,
          height,
        }
      }
    }

    return newRecord
  }

  render(data: string): void {
    const CTX = this.canvas_ctx

    CTX.textAlign = 'start'
    CTX.textBaseline = 'top'
    CTX.strokeStyle = 'red'
    CTX.font = '16px mono sans-serif'

    const PARSED_JSON = JSON.parse(data)
    const flattenData: FlattenDataRecord = Renderer.convertJsonToFlattenRendererData(PARSED_JSON)
    const sizedData = Renderer.calcSize(flattenData, CTX)

    console.log(sizedData)

  }
}

export default Renderer


