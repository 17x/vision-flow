export interface RectangleRenderProps extends Rect {
  fillStyle: string
  strokeStyle: string
  lineWidth: number
}

const rectRender = (ctx: CanvasRenderingContext2D, rects: RectangleRenderProps[]): void => {
  const rectQueue: Set<string> = new Set()
  const separateChar = ','
  ctx.save();

  rects.forEach((props) => {
    const s = Object.values(props).join(separateChar)

    rectQueue.add(s);
  })

  let lastLineWidth = NaN;
  let lastStrokeStyle = ''
  let lastFillStyle = ''

  rectQueue.forEach((str) => {
    const arr = str.split(separateChar);
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

  console.log(rectQueue.size)
  ctx.restore();
}

export default rectRender;

