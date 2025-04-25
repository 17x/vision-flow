import {RenderPropsList} from './renderer/type'

export const generateBoundingRectFromRotatedRect = ({x, y, width, height}: Rect, rotation: number): BoundingRect => {
  const centerX = x + width / 2
  const centerY = y + height / 2
  const rad = (rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin)
  const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos)
  const rectX = centerX - rotatedWidth / 2
  const rectY = centerY - rotatedHeight / 2

  return generateBoundingRectFromRect({
    x: rectX,
    y: rectY,
    width: rotatedWidth,
    height: rotatedHeight,
  })
}

export const generateBoundingRectFromRect = (rect: Rect): BoundingRect => {
  const {x, y, width, height} = rect

  return {
    x,
    y,
    width,
    height,
    top: y,
    bottom: y + height,
    left: x,
    right: x + width,
    cx: x + width / 2,
    cy: y + height / 2,
  }
}

export const generateBoundingRectFromTwoPoints = (p1: Point, p2: Point): BoundingRect => {
  const minX = Math.min(p1.x, p2.x)
  const maxX = Math.max(p1.x, p2.x)
  const minY = Math.min(p1.y, p2.y)
  const maxY = Math.max(p1.y, p2.y)

  return generateBoundingRectFromRect({
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  })
}

export function rectsOverlap(r1: BoundingRect, r2: BoundingRect): boolean {
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  )
}

/*export function rectInside(inner: BoundingRect, outer: BoundingRect): boolean {
  return (
    inner.left >= outer.left &&
    inner.right <= outer.right &&
    inner.top >= outer.top &&
    inner.bottom <= outer.bottom
  )
}*/

export const isInsideRotatedRect = ({x: mouseX, y: mouseY}: Point, rect: Rect, rotation: number): boolean => {
  const {
    x: centerX,
    y: centerY,
    width,
    height,
  } = rect
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

export const isNegativeZero = (x: number) => x === 0 && (1 / x) === -Infinity

export function throttle<T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>): void => {
    const now = Date.now()

    const invoke = () => {
      lastCall = now
      func(...args)
    }

    if (now - lastCall >= delay) {
      invoke()
    } else {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(invoke, delay - (now - lastCall))
    }
  }
}

export const setFloatOnProps = <T extends RenderPropsList, K extends keyof RenderPropsList>(obj: T, keys: K[]): void => {
  keys.forEach((key) => {
    (obj[key] as number) = Math.floor(obj[key] as number)
  })
}