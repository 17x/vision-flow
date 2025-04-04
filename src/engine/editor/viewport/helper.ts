import {screenToCanvas} from "./TransformUtils.ts";

export const getBoxControlPoints = (cx: number, cy: number, w: number, h: number, rotation: number): Position[] => {
  const halfW = w / 2
  const halfH = h / 2

  // Convert rotation angle from degrees to radians
  const angle = rotation * (Math.PI / 180)

  // Precompute sine and cosine to optimize repeated calculations
  const cosAngle = Math.cos(angle)
  const sinAngle = Math.sin(angle)

  // Control points before rotation
  const points: Position[] = [
    {x: cx - halfW, y: cy - halfH}, // Top-left
    {x: cx, y: cy - halfH},         // Top-center
    {x: cx + halfW, y: cy - halfH}, // Top-right
    {x: cx + halfW, y: cy},         // Right-center
    {x: cx + halfW, y: cy + halfH}, // Bottom-right
    {x: cx, y: cy + halfH},         // Bottom-center
    {x: cx - halfW, y: cy + halfH}, // Bottom-left
    {x: cx - halfW, y: cy},         // Left-center
  ]

  // Rotate each point around the center
  return points.map(({x, y}) => {
    const dx = x - cx
    const dy = y - cy

    // Apply rotation
    return {
      x: cx + dx * cosAngle - dy * sinAngle,
      y: cy + dx * sinAngle + dy * cosAngle,
    }
  })
}

export const isInsideRotatedRect = (
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  rotation: number
): boolean => {
  if (width <= 0 || height <= 0) {
    return false // Invalid rectangle dimensions
  }

  // If the rotation is 0, no need to apply any rotation logic
  if (rotation === 0) {
    const halfWidth = width / 2
    const halfHeight = height / 2

    return (
      mouseX >= centerX - halfWidth && mouseX <= centerX + halfWidth &&
      mouseY >= centerY - halfHeight && mouseY <= centerY + halfHeight
    )
  }

  // Convert rotation angle from degrees to radians
  const angle = rotation * (Math.PI / 180)

  // Pre-calculate sine and cosine of the rotation angle for optimization
  const cosAngle = Math.cos(angle)
  const sinAngle = Math.sin(angle)

  // Step 1: Translate the mouse position to the local space of the rotated rectangle
  const dx = mouseX - centerX
  const dy = mouseY - centerY

  // Step 2: Undo the rotation by rotating the mouse position back
  const unrotatedX = dx * cosAngle + dy * sinAngle
  const unrotatedY = -dx * sinAngle + dy * cosAngle

  // Step 3: Check if the unrotated mouse position lies within the bounds of the axis-aligned rectangle
  const halfWidth = width / 2
  const halfHeight = height / 2

  return (
    unrotatedX >= -halfWidth && unrotatedX <= halfWidth &&
    unrotatedY >= -halfHeight && unrotatedY <= halfHeight
  )
}

export const isInsideRect = (
  {
    x: mouseX,
    y: mouseY
  }: {
    x: number,
    y: number
  },
  {
    x,
    y,
    width,
    height
  }: Rect
): boolean => {
  if (width <= 0 || height <= 0) {
    return false
  }

  return (
    mouseX >= x && mouseX <= width &&
    mouseY >= y && mouseY <= height
  )

}

export const hoverOnModule = () => {
  return true
}

interface DrawCrossLineProps {
  ctx: CanvasRenderingContext2D
  mousePoint: Position
  scale: number
  dpr: DPR
  offset: Position
  virtualRect: BoundingRect
}

export const drawCrossLine = ({
                                ctx,
                                mousePoint,
                                scale,
                                dpr,
                                offset: {x: offsetX, y: offsetY},
                                virtualRect: {left: minX, top: minY, right: maxX, bottom: maxY}
                              }: DrawCrossLineProps): void => {
  const textOffsetX = 10 / (dpr * scale)
  const textOffsetY = 10 / (dpr * scale)
  const {x, y} = screenToCanvas(scale, offsetX * dpr, offsetY * dpr, mousePoint.x * dpr, mousePoint.y * dpr)
  const crossLineColor = '#ff0000'
  const textColor = '#ff0000'
  const textShadowColor = '#000'

  ctx.save()
  ctx.textBaseline = 'alphabetic'
  ctx.font = `${24 / scale}px sans-serif`
  // ctx.setLineDash([3 * dpr * scale, 5 * dpr * scale])
  ctx.fillStyle = textColor
  ctx.shadowColor = crossLineColor;
  ctx.shadowBlur = 1;

  ctx.fillText(`${Math.floor(x)}, ${Math.floor(y)}`, x + textOffsetX, y - textOffsetY, 200 / scale)
  ctx.lineWidth = 2 / (dpr * scale)
  ctx.strokeStyle = crossLineColor
  ctx.shadowColor = textShadowColor
  ctx.shadowBlur = 0;
  ctx.beginPath()
  ctx.moveTo(minX, y)
  ctx.lineTo(maxX, y)
  ctx.moveTo(x, minY)
  ctx.lineTo(x, maxY)
  ctx.stroke()
  ctx.restore()
}