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
  // const rectQueue: RenderItem<'rect'>[] = []
  // const textQueue: RenderItem<'text'>[] = []
  // const lineQueue: RenderItem<'line'>[] = []
  // const curveQueue: RenderItem<'curve'>[] = []
  const rects: RectangleRenderProps[] = []
  const fillStyle = "#5491f8";
  const strokeStyle = "#000";
  const lineWidth = 1;

  ctx.clearRect(0,
    0,
    ctx.canvas.width,
    ctx.canvas.height);

  modules.forEach((module) => {
    if (module.type === 'rectangle') {
      const {x, y, width, height} = module

      rects.push({x, y, width, height, fillStyle, strokeStyle, lineWidth})
    }
  })

  rectRender(ctx, rects)
  /*
  rectQueue.forEach((item) => {
    const {x, y, width, height} = item.data

    ctx.strokeRect(x,
      y,
      width,
      height)
  })*/

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

export interface RectangleRenderProps extends Rect {
  fillStyle: string
  strokeStyle: string
  lineWidth: number
}

export const rectRender = (ctx: CanvasRenderingContext2D, rects: RectangleRenderProps[]): void => {
  const rectQueue: Set<string> = new Set()
  const arr = []
  ctx.save();

  rects.forEach(({x, y, width, height, lineWidth, strokeStyle, fillStyle}) => {
    arr.push(`${x}-${y}-${width}-${height}-${lineWidth}-${strokeStyle}-${fillStyle}`)
    rectQueue.add(`${x}-${y}-${width}-${height}-${lineWidth}-${strokeStyle}-${fillStyle}`);
  })

  let lastLineWidth = NaN;
  let lastStrokeStyle = ''
  let lastFillStyle = ''

  console.log('rects size: ', arr.length)
  console.log('rectQueue size: ', rectQueue.size)
  rectQueue.forEach((s) => {
    const arr = s.split('-');
    const x = parseFloat(arr[0]);
    const y = parseFloat(arr[1]);
    const width = parseFloat(arr[2]);
    const height = parseFloat(arr[3]);
    const lineWidth = parseFloat(arr[4]);
    const strokeStyle = arr[5];
    const fillStyle = arr[6];

    if (lineWidth !== lastLineWidth) {
      ctx.lineWidth = lineWidth;
      lastLineWidth = lineWidth;
    }
    if (strokeStyle !== lastStrokeStyle) {
      ctx.strokeStyle = strokeStyle;
      lastStrokeStyle = strokeStyle;
    }

    if (fillStyle !== lastFillStyle) {
      ctx.fillStyle = fillStyle;
      lastFillStyle = fillStyle;
    }

    ctx.strokeRect(x, y, width, height);
  })

  ctx.restore();
}
export default render