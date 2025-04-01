import Connector from "../modules/connectors/connector.ts"
import rectRender from "./rectRender.ts"
import lineRender, {LineRenderProps} from "./lineRender.ts"
import {RectangleRenderProps} from "./type"
import Rectangle from "../modules/shapes/rectangle.ts"

export type TransformType = [a: number, b: number, c: number, d: number, e: number, f: number]

interface RenderProps {
  ctx: CanvasRenderingContext2D
  modules: Map<string, ModuleType>
  transform: TransformType
  dpr: DPR
}

const render = ({ctx, modules, dpr, transform}: RenderProps): void => {
  const frame: RectangleRenderProps = {
    x: 400,
    y: 500,
    width: 800,
    height: 1000,
    opacity: 100,
    lineWidth: 1,
    lineColor: '#000000',
    fillColor: '#dfdfdf66',
  }

  const rects: RectangleRenderProps[] = [frame]
  const lines: LineRenderProps[] = []
  const texts: unknown = []

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  )

  if (transform) {
    /*
      ctx transform parameters:
    - a (horizontal scaling): Scaling factor along the x-axis. Values greater than 1 scale the content,
      and values less than 1 shrink the content along the x-axis.
    - b (vertical skewing): Skewing factor for the x-axis. Non-zero values will skew the content along the x-axis.
    - c (horizontal skewing): Skewing factor for the y-axis. Non-zero values will skew the content along the y-axis.
    - d (vertical scaling): Scaling factor along the y-axis. Values greater than 1 scale the content,
      and values less than 1 shrink the content along the y-axis.
    - e (horizontal translation): Translation (movement) along the x-axis. Positive values move the content
      to the right, negative values move it to the left.
    - f (vertical translation): Translation (movement) along the y-axis. Positive values move the content
      down, negative values move it up.
    */
    console.log(transform)
    const [a, b, c, d, e, f] = transform
    ctx.setTransform(a, b, c, d, e * dpr, f * dpr)
  }

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

      texts.push({x:x+10, y:y+10, width, height, id: id.match(/\d+$/g)![0]})
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