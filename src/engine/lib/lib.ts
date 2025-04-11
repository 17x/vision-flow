// import typeCheck from '../../utilities/typeCheck.ts'

import {ResizeHandler} from '../editor/selection/type'

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

export function createHandlersForRect({
                                        id,
                                        cx,
                                        cy,
                                        width,
                                        height,
                                        rotation,
                                      }: {
  id: string;
  cx: number;
  cy: number;
  width: number;
  height: number;
  rotation: number;
}): ResizeHandler[] {
  const localHandleOffsets = [
    {type: 'resize', name: 'tl', x: 0, y: 0, cursor: 'nwse-resize'}, // top-left
    {type: 'resize', name: 't', x: 0.5, y: 0, cursor: 'ns-resize'}, // top-center
    {type: 'resize', name: 'tr', x: 1, y: 0, cursor: 'nesw-resize'}, // top-right
    {type: 'resize', name: 'r', x: 1, y: 0.5, cursor: 'ew-resize'}, // right-center
    {type: 'resize', name: 'br', x: 1, y: 1, cursor: 'nwse-resize'}, // bottom-right
    {type: 'resize', name: 'b', x: 0.5, y: 1, cursor: 'ns-resize'}, // bottom-center
    {type: 'resize', name: 'bl', x: 0, y: 1, cursor: 'nesw-resize'}, // bottom-left
    {type: 'resize', name: 'l', x: 0, y: 0.5, cursor: 'ew-resize'}, // left-center
    {type: 'rotate', name: 'rotate-tl', x: -0.1, y: -0.1, cursor: 'rotate'}, // left-center
    {type: 'rotate', name: 'rotate-tr', x: 1.1, y: -0.1, cursor: 'rotate'}, // left-center
    {type: 'rotate', name: 'rotate-br', x: 1.1, y: 1.1, cursor: 'rotate'}, // left-center
    {type: 'rotate', name: 'rotate-bl', x: -0.1, y: 1.1, cursor: 'rotate'}, // left-center
  ] as const

  return localHandleOffsets.map((offset) => {
    // Calculate the handle position in local coordinates
    const handleX = cx - width / 2 + offset.x * width
    const handleY = cy - height / 2 + offset.y * height
    // Rotate the handle position around the center
    const rotated = rotatePoint(handleX, handleY, cx, cy, rotation)
    let cursor = offset.cursor

    if (offset.type === 'resize') {
      cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
    }
    return {
      id: `${id}`,
      type: offset.type,
      cursor,
      data: {
        x: rotated.x,
        y: rotated.y,
        width: 0,
        position: offset.name,
        rotation,
      },
    }
  })
}

function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  rotation: number,
) {
  const dx = px - cx
  const dy = py - cy
  const angle = rotation * (Math.PI / 180)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  }
}
function getCursor(handlerX: number, handlerY: number, centerX: number, centerY: number, rotation: number): string {
  // Step 1: Transform global point into local space (cancel rotation)
  const dx = handlerX - centerX
  const dy = handlerY - centerY

  const rad = (-rotation * Math.PI) / 180 // inverse rotation
  const localX = dx * Math.cos(rad) - dy * Math.sin(rad)
  const localY = dx * Math.sin(rad) + dy * Math.cos(rad)

  // Step 2: Decide quadrant or edge
  const absX = Math.abs(localX)
  const absY = Math.abs(localY)
  const threshold = 0.5 // to decide between corner vs side

  if (absX > absY) {
    // Horizontal
    if (localX > 0) return 'ew-resize' // Right
    else return 'ew-resize'           // Left
  } else if (absY > absX) {
    // Vertical
    if (localY > 0) return 'ns-resize' // Bottom
    else return 'ns-resize'           // Top
  } else {
    // Corner
    if (localX > 0 && localY > 0) return 'nwse-resize' // Bottom-right
    if (localX < 0 && localY < 0) return 'nwse-resize' // Top-left
    if (localX > 0 && localY < 0) return 'nesw-resize' // Top-right
    if (localX < 0 && localY > 0) return 'nesw-resize' // Bottom-left
  }

  return 'default'
}