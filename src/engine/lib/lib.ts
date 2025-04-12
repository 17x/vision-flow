// import typeCheck from '../../utilities/typeCheck.ts'

import {
  ResizeCursor,
  ResizeHandleName,
  ResizeHandler,
  ResizeTransform,
} from '../editor/selection/type'

export const getBoxControlPoints = (
  cx: number,
  cy: number,
  w: number,
  h: number,
  rotation: number,
): Point[] => {
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
    {x: cx, y: cy - halfH}, // Top-center
    {x: cx + halfW, y: cy - halfH}, // Top-right
    {x: cx + halfW, y: cy}, // Right-center
    {x: cx + halfW, y: cy + halfH}, // Bottom-right
    {x: cx, y: cy + halfH}, // Bottom-center
    {x: cx - halfW, y: cy + halfH}, // Bottom-left
    {x: cx - halfW, y: cy}, // Left-center
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
  ctx: CanvasRenderingContext2D;
  mousePoint: Point;
  scale: number;
  dpr: DPR;
  offset: Point;
  virtualRect: BoundingRect;
}

/** Convert canvas coordinates to screen coordinates */
export function canvasToScreen(
  scale: number,
  offsetX: number,
  offsetY: number,
  canvasX: number,
  canvasY: number,
): {
  x: number;
  y: number;
} {
  return {
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY,
  }
}

/** Convert screen (mouse) coordinates to canvas coordinates */
export function screenToCanvas(
  scale: number,
  offsetX: number,
  offsetY: number,
  screenX: number,
  screenY: number,
): {
  x: number;
  y: number;
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
  const {x, y} = screenToCanvas(
    scale,
    offsetX * dpr,
    offsetY * dpr,
    mousePoint.x * dpr,
    mousePoint.y * dpr,
  )
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

  ctx.fillText(
    `${Math.floor(x)}, ${Math.floor(y)}`,
    x + textOffsetX,
    y - textOffsetY,
    200 / scale,
  )
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

export const getSymmetricDifference = <T>(
  setA: Set<T>,
  setB: Set<T>,
): Set<T> => {
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
    {
      type: 'resize',
      name: 'tl',
      x: 0,
      y: 0,
      originCursor: 'nwse-resize',
      cursor: 'nwse-resize',
    }, // top-left
    {
      type: 'resize',
      name: 't',
      x: 0.5,
      y: 0,
      originCursor: 'ns-resize',
      cursor: 'ns-resize',
    }, // top-center
    {
      type: 'resize',
      name: 'tr',
      x: 1,
      y: 0,
      originCursor: 'nesw-resize',
      cursor: 'nesw-resize',
    }, // top-right
    {
      type: 'resize',
      name: 'r',
      x: 1,
      y: 0.5,
      originCursor: 'ew-resize',
      cursor: 'ew-resize',
    }, // right-center
    {
      type: 'resize',
      name: 'br',
      x: 1,
      y: 1,
      originCursor: 'nwse-resize',
      cursor: 'nwse-resize',
    }, // bottom-right
    {
      type: 'resize',
      name: 'b',
      x: 0.5,
      y: 1,
      originCursor: 'ns-resize',
      cursor: 'ns-resize',
    }, // bottom-center
    {
      type: 'resize',
      name: 'bl',
      x: 0,
      y: 1,
      originCursor: 'nesw-resize',
      cursor: 'nesw-resize',
    }, // bottom-left
    {
      type: 'resize',
      name: 'l',
      x: 0,
      y: 0.5,
      originCursor: 'ew-resize',
      cursor: 'ew-resize',
    }, // left-center
    {
      type: 'rotate',
      name: 'rotate-tl',
      x: -0.1,
      y: -0.1,
      originCursor: 'rotate',
      cursor: 'rotate',
    }, // left-center
    {
      type: 'rotate',
      name: 'rotate-tr',
      x: 1.1,
      y: -0.1,
      originCursor: 'rotate',
      cursor: 'rotate',
    }, // left-center
    {
      type: 'rotate',
      name: 'rotate-br',
      x: 1.1,
      y: 1.1,
      originCursor: 'rotate',
      cursor: 'rotate',
    }, // left-center
    {
      type: 'rotate',
      name: 'rotate-bl',
      x: -0.1,
      y: 1.1,
      originCursor: 'rotate',
      cursor: 'rotate',
    }, // left-center
  ] as const
  // const module = this.moduleMap.get(id)

  const handlers = localHandleOffsets.map((offset) => {
    // Calculate the handle position in local coordinates
    const handleX = cx - width / 2 + offset.x * width
    const handleY = cy - height / 2 + offset.y * height
    // Rotate the handle position around the center
    const rotated = rotatePoint(handleX, handleY, cx, cy, rotation)
    let cursor: ResizeCursor = offset.cursor as ResizeCursor
    if (offset.type === 'resize') {
      cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
    }

    return {
      id: `${id}`,
      type: offset.type,
      name: offset.name,
      cursor,
      moduleOrigin: {cx, cy, width, height},
      data: {
        x: rotated.x,
        y: rotated.y,
        width: 0,
        position: offset.name,
        rotation,
      },
    }
  })

  return handlers
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

function getCursor(
  x: number,
  y: number,
  cx: number,
  cy: number,
  threshold = 4,
): ResizeCursor {
  const dx = x - cx
  const dy = y - cy

  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  // Corner handles
  if (absDx > threshold && absDy > threshold) {
    if (dx < 0 && dy < 0) return 'nwse-resize' // Top-left
    if (dx > 0 && dy < 0) return 'nesw-resize' // Top-right
    if (dx > 0 && dy > 0) return 'nwse-resize' // Bottom-right
    if (dx < 0 && dy > 0) return 'nesw-resize' // Bottom-left
  }

  // Side handles
  if (absDx <= threshold && absDy > threshold) return 'ns-resize' // Top or Bottom
  if (absDy <= threshold && absDx > threshold) return 'ew-resize' // Left or Right

  return 'default'
}

export function getResizeTransform(
  name: ResizeHandleName,
  symmetric = false,
): ResizeTransform {
  const base = (() => {
    switch (name) {
      case 'tl':
        return {dx: -1, dy: -1, cx: 0.5, cy: 0.5}
      case 't':
        return {dx: 0, dy: -1, cx: 0.0, cy: 0.5}
      case 'tr':
        return {dx: 1, dy: -1, cx: -0.5, cy: 0.5}
      case 'r':
        return {dx: 1, dy: 0, cx: -0.5, cy: 0.0}
      case 'br':
        return {dx: 1, dy: 1, cx: -0.5, cy: -0.5}
      case 'b':
        return {dx: 0, dy: 1, cx: 0.0, cy: -0.5}
      case 'bl':
        return {dx: -1, dy: 1, cx: 0.5, cy: -0.5}
      case 'l':
        return {dx: -1, dy: 0, cx: 0.5, cy: 0.0}
      default:
        throw new Error(`Unsupported resize handle: ${name}`)
    }
  })()

  if (symmetric) {
    // When resizing symmetrically, center should not move.
    return {...base, cx: 0, cy: 0}
  }

  return base
}

type ResizeTransformResult = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function applyResizeTransform({
                                       downPoint,
                                       movePoint,
                                       initialWidth,
                                       initialHeight,
                                       initialCX,
                                       initialCY,
                                       rotation,
                                       handleName,
                                       scale,
                                       dpr,
                                       altKey = false,
                                       shiftKey = false,
                                     }: {
  downPoint: { x: number; y: number };
  movePoint: { x: number; y: number };
  initialWidth: number;
  initialHeight: number;
  initialCX: number;
  initialCY: number;
  rotation: number;
  handleName: ResizeHandleName;
  scale: number;
  dpr: number;
  altKey?: boolean;
  shiftKey?: boolean;
}): ResizeTransformResult {
  // Calculate raw movement in screen coordinates
  const dxScreen = movePoint.x - downPoint.x
  const dyScreen = movePoint.y - downPoint.y

  // Convert to canvas coordinates and apply DPR
  const dx = (dxScreen / scale) * dpr
  const dy = (dyScreen / scale) * dpr

  // Convert rotation to radians and calculate rotation matrix
  const angle = -rotation * (Math.PI / 180)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  // Transform the movement vector into the object's local coordinate system
  const localDX = dx * cos - dy * sin
  const localDY = dx * sin + dy * cos

  // Get the resize transform based on the handle
  const t = getResizeTransform(handleName, altKey)

  // Calculate the size changes in local coordinates
  let deltaX = localDX * t.dx
  let deltaY = localDY * t.dy

  // Maintain aspect ratio if shift key is pressed
  if (shiftKey) {
    const aspect = initialWidth / initialHeight || 1
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (absDeltaX > absDeltaY) {
      deltaY = (deltaX / aspect) * Math.sign(t.dy || 1)
    } else {
      deltaX = deltaY * aspect * Math.sign(t.dx || 1)
    }
  }

  // Apply the resize transform
  const factor = altKey ? 2 : 1
  const width = initialWidth + deltaX * factor
  const height = initialHeight + deltaY * factor

  // Calculate the center movement in local coordinates
  const centerDeltaX = -deltaX * t.cx * factor
  const centerDeltaY = -deltaY * t.cy * factor

  // Transform the center movement back to global coordinates
  const globalCenterDeltaX = centerDeltaX * cos + centerDeltaY * sin
  const globalCenterDeltaY = -centerDeltaX * sin + centerDeltaY * cos

  // Calculate the new center position
  const x = initialCX + globalCenterDeltaX
  const y = initialCY + globalCenterDeltaY

  return {x, y, width, height}
}
