import Connector from "../modules/connectors/connector.ts";
import rectRender, {RectangleRenderProps} from "./rectRender.ts";
import Rectangle from "../modules/shapes/rectangle.ts";
import lineRender, {LineRenderProps} from "./lineRender.ts";

interface RenderProps {
  ctx: CanvasRenderingContext2D
  modules: Map<string, Modules>
}

// type RenderTypes = 'line' | 'curve' | 'text' | 'rect'
type RenderTypes = 'text' | 'rect'

interface TextRenderProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

type RenderDataPropsMap = {
  rect: RectangleRenderProps;
  text: TextRenderProps;
  line: never;
  curve: never;
};

interface RenderItem<T extends RenderTypes> {
  type: T;
  data: RenderDataPropsMap[T];
}

const render = ({ctx, modules}: RenderProps): void => {
  const rects: RectangleRenderProps[] = []
  const lines: LineRenderProps[] = []
  const fillStyle = "#5491f8";
  const strokeStyle = "#000";
  const lineWidth = 1;

  ctx.clearRect(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );

  modules.forEach((module) => {
    if (module.type === 'rectangle') {
      const {x, y, width, height} = module as Rectangle

      rects.push({x, y, width, height, fillStyle, strokeStyle, lineWidth})
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