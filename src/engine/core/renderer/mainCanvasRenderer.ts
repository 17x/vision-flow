import rectRender from "./rectRender.ts"
import lineRender, {LineRenderProps} from "./lineRender.ts"
import {RectangleRenderProps} from "./type"
import Rectangle from "../modules/shapes/rectangle.ts";
import Connector from "../modules/connectors/connector.ts";

interface RenderProps {
  ctx: CanvasRenderingContext2D
  modules: Map<string, ModuleType>
  // transform: TransformType
  // dpr: DPR
}

const render = ({ctx, modules}: RenderProps): void => {
  const frame: RectangleRenderProps = {
    x: 400,
    y: 500,
    width: 800,
    height: 1000,
    opacity: 100,
    lineWidth: 1,
    lineColor: '#000000',
    fillColor: '#fff',
  }

  const rects: RectangleRenderProps[] = [frame]
  const lines: LineRenderProps[] = []
  const texts = []

  modules.forEach((module) => {
    if (module.type === 'rectangle') {

      const {
        x,
        y,
        width,
        height,
        enableFill,
        enableLine,
        opacity,
        lineWidth,
        fillColor,
        lineColor,
        rotation,
        gradient,
        radius,
        id
      } = (module as Rectangle).getDetails()

      if ((enableFill && opacity > 0) || enableLine) {
        rects.push({x, y, width, height, fillColor, opacity, lineWidth, lineColor, rotation, gradient, radius})
      }

      texts.push({x: x + 10, y: y + 10, width, height, id: id.match(/\d+$/g)![0]})
    }

    if (module.type === 'connector') {
      const startModule = modules.get((module as Connector).start)
      const endModule = modules.get((module as Connector).end)
      const rect1 = startModule!.getBoundingRect()
      const rect2 = endModule!.getBoundingRect()

      lines.push({
        startX: rect1.centerX,
        startY: rect1.bottom,
        endX: rect2.centerX,
        endY: rect2.top,
        fillStyle: "#5491f8",
        lineWidth: 1
      })
      // rects.push({x, y, width, height, fillStyle, strokeStyle, lineWidth})
    }
  })

  rectRender(ctx, rects)
  lineRender(ctx, lines)
  textRender(ctx, texts)
}

const textRender = (ctx: CanvasRenderingContext2D, texts): void => {
  ctx.font = 'sans-serif'
  ctx.textBaseline = 'top'
  texts.forEach(({id, x, y, width, height}) => {
    ctx.fillText(id, x - width / 2 + 5, y - height / 2 + 5, 100)
  })
}

export default render