import typeCheck from '../../utilities/typeCheck.ts'

export const getBoxControlPoints = (cx: number, cy: number, w: number, h: number, rotation: number): Point[] => {
  const halfW = w / 2
  const halfH = h / 2

  // Convert rotation angle from degrees to radians
  const angle = rotation * (Math.PI / 180)

  // Precompute sine and cosine to optimize repeated calculations
  const cosAngle = Math.cos(angle)
  const sinAngle = Math.sin(angle)

  // Control points before rotation
  const points: Point[] = [
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

interface DrawCrossLineProps {
  ctx: CanvasRenderingContext2D
  mousePoint: Point
  scale: number
  dpr: DPR
  offset: Point
  virtualRect: BoundingRect
}

/** Convert canvas coordinates to screen coordinates */
export function canvasToScreen(scale: number, offsetX: number, offsetY: number, canvasX: number, canvasY: number): {
  x: number;
  y: number
} {
  return {
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY,
  }
}

/** Convert screen (mouse) coordinates to canvas coordinates */
export function screenToCanvas(scale: number, offsetX: number, offsetY: number, screenX: number, screenY: number): {
  x: number;
  y: number
} {
  return {
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale,
  }
}

export const drawCrossLine = ({
                                ctx,
                                mousePoint,
                                scale,
                                dpr,
                                offset: {x: offsetX, y: offsetY},
                                virtualRect: {left: minX, top: minY, right: maxX, bottom: maxY},
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
  ctx.shadowColor = crossLineColor
  ctx.shadowBlur = 1

  ctx.fillText(`${Math.floor(x)}, ${Math.floor(y)}`, x + textOffsetX, y - textOffsetY, 200 / scale)
  ctx.lineWidth = 2 / (dpr * scale)
  ctx.strokeStyle = crossLineColor
  ctx.shadowColor = textShadowColor
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.moveTo(minX, y)
  ctx.lineTo(maxX, y)
  ctx.moveTo(x, minY)
  ctx.lineTo(x, maxY)
  ctx.stroke()
  ctx.restore()
}

export const areSetsEqual = <T>(setA: Set<T>, setB: Set<T>): boolean => {
  if (setA.size !== setB.size) return false
  for (const item of setA) {
    if (!setB.has(item)) return false
  }
  return true
}

export const getSymmetricDifference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const result = new Set<T>()

  for (const item of setA) {
    if (!setB.has(item)) result.add(item)
  }
  for (const item of setB) {
    if (!setA.has(item)) result.add(item)
  }

  return result
}