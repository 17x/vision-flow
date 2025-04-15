import Rectangle from '../../core/modules/shapes/rectangle.ts'
import Editor from '../editor.ts'

type FrameType = 'A4' | 'A4L' | 'photo1'

export const createFrame = (p: FrameType, id: UID): ModuleInstance => {
  let width: number = 0
  let height: number = 0
  let x: number = 0
  let y: number = 0

  if (p === 'A4' || p === 'A4L') {
    const RATIO = 1.414142857

    if (p === 'A4L') {
      // A4 landscape
      height = 1000
      width = RATIO * height
    } else {
      width = 1000
      height = RATIO * width
    }
  } else if (p === 'photo1') {
    width = 35
    height = 55
  } else if (p === 'bigSquare') {
    width = 500
    height = 500
  }

  x = width / 2
  y = height / 2

  return new Rectangle({
    id,
    x,
    y,
    width,
    height,
    opacity: 100,
    lineWidth: 1,
    lineColor: '#000000',
    fillColor: '#fff',
    layer: -1,
  })
}

/*
* Fit a world coordinate based rect into pixel-based viewport
* which can set the rect middle of the viewport
* paddingScale can leave some space between the frame and the viewport boundary
* */
export const fitRectToViewport = (rect: Rect, viewport: Rect, paddingScale = 0.02): {
  scale: number
  offsetX: number
  offsetY: number
} => {
  const {width: viewWidth, height: viewHeight} = viewport
  const {width: rectWidth, height: rectHeight} = rect
  const scaleX = viewWidth / rectWidth
  const scaleY = viewHeight / rectHeight
  const scale = Math.min(scaleX, scaleY) - Math.min(scaleX, scaleY) * paddingScale
  const scaledRectWidth = rect.width * scale
  const scaledRectHeight = rect.width * scale
  const scaledRectX = rect.x * scale
  const scaledRectY = rect.y * scale

  const offsetX = (viewWidth - scaledRectWidth) / 2 - scaledRectX
  const offsetY = (viewHeight - scaledRectHeight) / 2 - scaledRectY

  return {
    scale,
    offsetX,
    offsetY,
  }
}

export function zoomAtPoint(
  this: Editor,
  point: Point,
  zoomFactor: number,
):
  {
    x: number;
    y: number;
  } {
  const {dpr, scale, rect, offset, viewportRect, worldRect} = this.viewport
  // const paddingScale = -zoomFactor
  const pixelOffsetX = point.x - rect.width / 2
  const pixelOffsetY = point.y - rect.height / 2
  const centerAreaThresholdX = rect.width / 8
  const centerAreaThresholdY = rect.height / 8
  console.log(point)
  /*  const virtualRect = {
      x: 0, y: 0, width: worldRect.width, height: worldRect.height,
    }*/
  // const f = fitRectToViewport(virtualRect, viewportRect, paddingScale / 2)
  let newOffsetX = offset.x
  let newOffsetY = offset.y
  let newScale = scale + zoomFactor
  const minScale = 0.01 * dpr
  const maxScale = 500 * dpr
  let clampedScale = Math.max(minScale, Math.min(maxScale, newScale))
  // if (clampedScale > maxScale || clampedScale < minScale) return false
  console.log(clampedScale)
  // fitRectToViewport
  if (Math.abs(pixelOffsetX) > centerAreaThresholdX) {
    newOffsetX = newOffsetX - pixelOffsetX * zoomFactor * dpr
  }

  if (Math.abs(pixelOffsetY) > centerAreaThresholdY) {
    newOffsetY = newOffsetY - pixelOffsetY * zoomFactor * dpr
  }

  return {
    // scale: newScale,
    offset: {
      x: newOffsetX,
      y: newOffsetY,
    },
  }
}