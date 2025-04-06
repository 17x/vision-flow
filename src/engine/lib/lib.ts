export function rectsOverlap(r1: BoundingRect, r2: BoundingRect): boolean {
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  )
}

export function rectInside(inner: BoundingRect, outer: BoundingRect): boolean {
  return (
    inner.left >= outer.left &&
    inner.right <= outer.right &&
    inner.top >= outer.top &&
    inner.bottom <= outer.bottom
  );
}

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

/*

/!** Calculate new zoom state *!/
export function calculateZoom(scale: number, mouseX: number, mouseY: number, zoomFactor: number): {
  scale: number;
  offsetX: number;
  offsetY: number
} {
  const mousePos = screenToCanvas(scale, 0, 0, mouseX, mouseY) // no offset involved for zooming calculation
  const newScale = scale * zoomFactor
  const newOffsetX = mouseX - mousePos.x * newScale
  const newOffsetY = mouseY - mousePos.y * newScale

  return {scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY}
}

/!** Calculate pan movement *!/
export function calculatePan(scale: number, offsetX: number, offsetY: number, lastX: number, lastY: number, mouseX: number, mouseY: number): {
  offsetX: number;
  offsetY: number
} {
  const dx = mouseX - lastX
  const dy = mouseY - lastY
  const newOffsetX = offsetX + dx
  const newOffsetY = offsetY + dy

  return {offsetX: newOffsetX, offsetY: newOffsetY}
}*/

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

export const isInsideRotatedRect = (
  {x: mouseX, y: mouseY}: Point,
  {x: centerX, y: centerY, width, height}: Rect,
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

export const generateBoundingRectFromRect = (rect: Rect): BoundingRect => {
  const {x, y, width, height} = rect;

  return {
    x,
    y,
    width,
    height,
    top: y,
    bottom: y + height,
    left: x,
    right: x + width,
    centerX: x + width / 2,
    centerY: y + height / 2,
  };
};

export const generateBoundingRectFromTwoPoints = (p1: Point, p2: Point): BoundingRect => {
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);

  return generateBoundingRectFromRect({
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  });
};

export const isNegativeZero = (x: number) => x === 0 && (1 / x) === -Infinity;