import typeCheck from "../../utilities/typeCheck.ts";

type RendererProps = {
  canvas: HTMLCanvasElement;
}

type StructuredRendererDataBase = {
  key: string,
  value?: JSONValue,
  type: 'string' | 'number' | 'boolean' | 'object' | 'null' | 'array',
  rect?: RectSizeBase,
  children?: StructuredRendererDataBase[]
}

class Renderer {
  private readonly canvas_ctx: CanvasRenderingContext2D;

  constructor({canvas}: RendererProps) {
    this.canvas_ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // console.log(this.canvas_ctx)
  }

  static calcSize(data: JSONValue): RectSizeBase {
    let w = 20
    let h = 20

    return {
      width: w,
      height: h
    }
  }

  static structureData(data: JSONValue, keyName?: string): StructuredRendererDataBase {
    const T: JSONStandardType = typeCheck(data)
    console.log(data)
    switch (T) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'null':
        return {type: T, value: data, rect: this.calcSize(data)};

      case 'array':
        return {type: 'array', children: (data as Array<JSONValue>).map((sub) => this.structureData(sub))}

      case 'object':
        return {
          keyName,
          type: 'object', children: Object.entries(data as JSONObject).map(([key, value]) => this.structureData(value,key))
        };

      default:
        throw new Error(`Unsupported type: ${T}`);
    }
  }

  static renderFn(data: StructuredRendererDataBase, ctx: CanvasRenderingContext2D): void {
    console.log(data)
    const T = data.type

    ctx.save()

    switch (T) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'null':

        break
    }

    data.children?.map(value => this.renderFn(value, ctx))

    ctx.restore()
    // ctx.moveTo(0, 0)
    // ctx.strokeText('error', 0, 0)
  }

  render(data: string): void {
    const CTX = this.canvas_ctx

    CTX.textAlign = 'start'
    CTX.textBaseline = 'top'
    CTX.strokeStyle = 'red'
    CTX.font = '16px mono sans-serif'

    try {
      const PARSED_JSON = JSON.parse(data)
      const STRUCTURED_DATA: StructuredRendererDataBase = Renderer.structureData(PARSED_JSON)

      Renderer.renderFn(STRUCTURED_DATA, CTX)
    } catch (e) {
      console.log(e)
    }
  }
}

export default Renderer


