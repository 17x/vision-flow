import typeCheck from "../../utilities/typeCheck.ts";

type RendererProps = {
  canvas: HTMLCanvasElement;
}

type FlattenRendererDataBase = {
  id: number
  key: string
  value: JSONPrimitiveValue
  type: JSONStandardType
  parentId?: number,
  children: number[]
}
type FlattenRendererData = Record<number, FlattenRendererDataBase>


class Renderer {
  private readonly canvas_ctx: CanvasRenderingContext2D;

  constructor({canvas}: RendererProps) {
    this.canvas_ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // console.log(this.canvas_ctx)
  }

  static convertJsonToFlattenRendererData(input: JSONValue): FlattenRendererData {
    const result: FlattenRendererData = {};
    let idCounter = 0;

    const traverse = (key: string, value: JSONValue, parentId?: number): FlattenRendererDataBase => {
      const nodeId = idCounter++;
      const nodeType = typeCheck(value);
      const isComplexType = nodeType === 'object' || nodeType === 'array';

      const node: FlattenRendererDataBase = {
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
          // result[child.id] = node
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

  static calcSize(data: JSONValue): RectSizeBase {
    let w = 20
    let h = 20

    return {
      width: w,
      height: h
    }
  }

  render(data: string): void {
    const CTX = this.canvas_ctx

    CTX.textAlign = 'start'
    CTX.textBaseline = 'top'
    CTX.strokeStyle = 'red'
    CTX.font = '16px mono sans-serif'

    try {
      const PARSED_JSON = JSON.parse(data)
      const flattenRendererData: FlattenRendererData = Renderer.convertJsonToFlattenRendererData(PARSED_JSON)

      Renderer.calcSize(flattenRendererData)
    } catch (e) {
      console.log(e)
    }
  }
}

export default Renderer


