import {RectangleRenderProps} from '../../core/renderer/type'
import {generateBoundingRectFromRect} from '../../core/utils.ts'

/*
* Fit a world coordinate based rect into pixel-based viewport
* which can put the rect middle of the viewport
* paddingScale can leave some space between the frame and the viewport boundary
* */
export const fitRectToViewport = (rect: Rect, viewport: Rect, paddingScale = 0.98): {
  scale: number
  offsetX: number
  offsetY: number
} => {
  const {width: viewWidth, height: viewHeight} = viewport
  const {width: rectWidth, height: rectHeight} = rect
  const scaleX = viewWidth / rectWidth
  const scaleY = viewHeight / rectHeight
  const scale = Math.min(scaleX, scaleY) * paddingScale
  const offsetX = ((viewWidth - rectWidth * scale) / 2 - rect.x * scale)
  const offsetY = ((viewHeight - rectHeight * scale) / 2 - rect.y * scale)

  return {
    scale,
    offsetX,
    offsetY,
  }
}

type FrameType = 'A4' | 'A4L' | 'photo1'

export const createFrame = (p: FrameType = 'A4'): Partial<RectangleRenderProps> & BoundingRect => {
  let width: number = 0
  let height: number = 0
  const x: number = 0
  const y: number = 0

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
  }

  const rect = generateBoundingRectFromRect({x, y, width, height})
  return {
    ...rect,
    opacity: 100,
    lineWidth: 1,
    lineColor: '#000000',
    fillColor: '#fff',
  }
}

export const createBoundingRect = (x: number, y: number, width: number, height: number): BoundingRect => {
  return {
    x,
    y,
    width,
    height,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    cx: x + width / 2,
    cy: y + height / 2,
  }
}