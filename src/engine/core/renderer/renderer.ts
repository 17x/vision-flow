import Connector from "../modules/connectors/connector.ts";
import rectRender from "./rectRender.ts";
import lineRender, {LineRenderProps} from "./lineRender.ts";
import {RectangleRenderProps} from "./type";
import Rectangle from "../modules/shapes/rectangle.ts";

interface RenderProps {
  ctx: CanvasRenderingContext2D
  modules: Map<string, ModuleType>
}

const render = ({ctx, modules}: RenderProps): void => {
  const rects: RectangleRenderProps[] = []
  const lines: LineRenderProps[] = []
  const fillStyle = "#5491f8";
  const lineWidth = 1;

  ctx.clearRect(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );

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
        fillColor,
        lineColor,
        rotation,
        gradient,
        radius
      } = (module as Rectangle).getDetails()

      if ((enableFill && opacity > 0) || enableLine) {
        rects.push({x, y, width, height, fillColor, opacity, lineWidth, lineColor, rotation, gradient, radius})
      }
    }

    if (module.type === 'connector') {
      const startModule = modules.get((module as Connector).start);
      const endModule = modules.get((module as Connector).end)
      const rect1 = startModule!.getBoundingRect()
      const rect2 = endModule!.getBoundingRect()

      lines.push({
        startX: rect1.centerX,
        startY: rect1.bottom,
        endX: rect2.centerX,
        endY: rect2.top,
        fillStyle,
        lineWidth
      })
      // rects.push({x, y, width, height, fillStyle, strokeStyle, lineWidth})
    }
  })

  rectRender(ctx, rects)
  lineRender(ctx, lines)
}

export default render