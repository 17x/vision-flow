import {RectangleRenderProps} from "../../core/renderer/type";

export const fitRectToViewport = (rect: Rect, viewport: Rect, dpr: DPR): {
  scale: number
  offsetX: number
  offsetY: number
} => {
  const {width: viewWidth, height: viewHeight} = viewport;
  const frameWidth = rect.width
  const frameHeight = rect.height
  const frameRatio = frameWidth / frameHeight;
  const viewportRatio = viewWidth / viewHeight;
  const paddingScale = 0.95
  let newScale: number
  let newOffsetX: number
  let newOffsetY: number

  if (frameRatio > viewportRatio) {
    // Frame is wider than viewport, scale based on width
    newScale = viewWidth / frameWidth * paddingScale;
  } else {
    // Frame is taller than viewport, scale based on height
    newScale = viewHeight / frameHeight * paddingScale;
  }

  newOffsetX = 0 + (viewWidth - frameWidth * newScale) / (dpr * 2)
  newOffsetY = 0 + (viewHeight - frameHeight * newScale) / (dpr * 2)

  return {
    scale: newScale,
    offsetX: newOffsetX,
    offsetY: newOffsetY,
  }
}

type FrameType = 'A4' | 'A4L' | 'photo1'

export const createFrame = (p: FrameType = 'A4'): RectangleRenderProps => {
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
  }

  x = width / 2
  y = height / 2

  return {
    x,
    y,
    width,
    height,
    opacity: 100,
    lineWidth: 1,
    lineColor: '#000000',
    fillColor: '#fff',
  };
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
    centerX: x + width / 2,
    centerY: y + height / 2,
  }
}