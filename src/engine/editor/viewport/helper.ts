import {RectangleRenderProps} from "../../core/renderer/type";
import {generateBoundingRectFromRect} from "../../core/utils.ts";

export const fitRectToViewport = (rect: Rect, viewport: Rect, dpr: DPR): {
  scale: number
  offsetX: number
  offsetY: number
} => {
  const {width: viewWidth, height: viewHeight} = viewport;
  const {width: rectWidth, height: rectHeight} = rect;
  // const frameRatio = rectWidth / rectHeight;
  // const viewportRatio = viewWidth / viewHeight;
  const paddingScale = 0.95
  let offsetX: number
  let offsetY: number
  const scaleX = viewWidth / rectWidth * paddingScale;
  const scaleY = viewHeight / rectHeight * paddingScale;
  const scale = Math.min(scaleX, scaleY);

  // -850 * scale / 2
  offsetX = (viewWidth - rectWidth * scale) / (dpr * 2)
  offsetY = (viewHeight - rectHeight * scale) / (dpr * 2)

  return {
    scale,
    offsetX,
    offsetY,
  }
}

export const fitRectToViewport2 = (rect, viewport, paddingScale = 1) => {
  const rectWidth = rect.width;
  const rectHeight = rect.height;

  const viewportWidth = viewport.width * paddingScale;
  const viewportHeight = viewport.height * paddingScale;

  // Calculate scale to fit rect into padded viewport while preserving aspect ratio
  const scaleX = viewportWidth / rectWidth;
  const scaleY = viewportHeight / rectHeight;
  const scale = Math.min(scaleX, scaleY);

  // Calculate the size of the scaled rect
  const scaledWidth = rectWidth * scale;
  const scaledHeight = rectHeight * scale;

  // Compute offsets to center the scaled rect in the full (unpadded) viewport
  const offsetX = (viewport.width - scaledWidth) / 2 - rect.x * scale;
  const offsetY = (viewport.height - scaledHeight) / 2 - rect.y * scale;

  return {
    scale,
    offsetX,
    offsetY
  };
};

type FrameType = 'A4' | 'A4L' | 'photo1'

export const createFrame = (p: FrameType = 'A4'): Partial<RectangleRenderProps> & BoundingRect => {
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

  const rect = generateBoundingRectFromRect({x, y, width, height})
  return {
    ...rect,
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
    cx: x + width / 2,
    cy: y + height / 2,
  }
}