import {BasicModuleProps} from "./modules/base.ts";
import {Modules} from "./modules/modules";
// import Rectangle from "./modules/shapes/Rectangle.ts";
// import Renderer from "../renderer";

// type Module = BasicModuleProps;

interface RenderProps {
  ctx: CanvasRenderingContext2D
  modules: Modules[]
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

interface RectRenderProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

type RenderDataPropsMap = {
  rect: RectRenderProps;
  text: TextRenderProps;
  line: never;
  curve: never;
};

interface RenderItem<T extends RenderTypes> {
  type: T;
  data: RenderDataPropsMap[T];
}

const render = ({ctx, modules}: RenderProps): void => {
  const rectQueue: RenderItem<'rect'>[] = []
  // const textQueue: RenderItem<'text'>[] = []
  // const lineQueue: RenderItem<'line'>[] = []
  // const curveQueue: RenderItem<'curve'>[] = []

  ctx.clearRect(0,
    0,
    ctx.canvas.width,
    ctx.canvas.height);

  modules.forEach((module) => {
    // console.log(module.type)

    if (module.type === 'rectangle') {
      console.log(module)
      const {x, y, width, height} = module
      // const data = [x, y, x + width, y, x + width, y + height, x, y + height];

      rectQueue.push({
        type: 'rect', data: {x, y, width, height}
      })

      // textQueue.push({type: 'text', data: '998'})
    }
  })

  rectQueue.forEach((item) => {
    const {x, y, width, height} = item.data
  console.log(item)

    ctx.strokeRect(x,
      y,
      width,
      height)
  })

  /*ctx.fillStyle = '#000'
  // line
  lineQueue.forEach(item => {
    ctx.moveTo(100, 100)
    ctx.lineTo(200, 100)
    ctx.lineTo(200, 200)
    ctx.lineTo(100, 200)
    ctx.lineTo(100, 100)
    // ctx.lineTo(100, 100)
    ctx.stroke()
  })

  ctx.font = '24px sans-serif'
  textQueue.forEach((item) => {
    ctx.fillText('14567890abcdefg', Math.random() * 1000, Math.random() * 500, 200)
  })*/
}

const a1: ModuleNames = 1
export default render