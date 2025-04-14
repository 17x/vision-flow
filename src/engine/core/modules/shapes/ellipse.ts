import Base, {BasicModuleProps} from '../base.ts'
import {generateBoundingRectFromRotatedRect} from '../../utils.ts'
import {RenderPropsMap} from '../../renderer/type'

export interface EllipseProps extends BasicModuleProps {
  x: number
  y: number
  r1: number
  r2: number
  fillColor: FillColor
  enableFill: boolean
}

class Ellipse extends Base {
  private x: number
  private y: number
  r1: number
  r2: number
  readonly fillColor: FillColor
  readonly enableFill: boolean

  constructor({
                x,
                y,
                fillColor,
                enableFill = true,
                r1,
                r2,
                ...rest
              }: EllipseProps) {
    super(rest)

    this.x = x
    this.y = y
    this.r1 = r1!
    this.r2 = r2!
    this.fillColor = fillColor as FillColor
    this.enableFill = enableFill
  }

  public getDetails<T extends boolean>(
    includeIdentifiers: T = true as T,
  ): T extends true ?
    EllipseProps :
    Omit<EllipseProps, 'id' | 'layer'> {

    return {
      // ...this.getSize(),
      fillColor: this.fillColor,
      enableFill: this.enableFill,
      x: this.x,
      y: this.y,
      r1: this.r1,
      r2: this.r2,
      ...super.getDetails(includeIdentifiers),
    } as T extends true ? EllipseProps : Omit<EllipseProps, 'id' | 'layer'>
  }

  public getSize(): Size {

  }

  getBoundingRect() {
    const {x: cx, y: cy, r1, r2, rotation} = this

    // If no rotation, the bounding box is just the width and height based on r1 and r2
    if (rotation === 0) {
      return generateBoundingRectFromRotatedRect({
        x: cx - r1,  // Left edge
        y: cy - r2,  // Top edge
        width: r1 * 2,  // Full width (r1 * 2)
        height: r2 * 2, // Full height (r2 * 2)
      }, rotation)
    }
  }

  move(x: number, y: number) {
    this.x += x
    this.y += y
  }

  protected getRenderData(): RenderPropsMap {
    const {x, y, fillColor, r1, r2} = this

    return {
      circles: [
        {
          x,
          y,
          lineColor: 'transparent',
          fillColor,
          r1,
          r2,
        },

      ],
    }
  }

  public hitTest(point: Point, borderPadding = 5): 'inside' | 'border' | null {
    const {x: cx, y: cy, r1, r2, rotation = 0} = this

    const cos = Math.cos(-rotation)
    const sin = Math.sin(-rotation)

    const dx = point.x - cx
    const dy = point.y - cy

    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    // Ellipse equation: (x^2 / a^2) + (y^2 / b^2)
    const norm = (localX * localX) / (r1 * r1) + (localY * localY) / (r2 * r2)

    const borderRange = borderPadding / Math.min(r1, r2) // normalized padding

    if (norm <= 1 + borderRange) {
      if (norm >= 1 - borderRange) {
        return 'border'
      }
      return 'inside'
    }

    return null
  }

  render(ctx: CanvasRenderingContext2D) {
    const {x, y, r1, r2, opacity, fillColor, rotation, dashLine, gradient} = this
    const {
      lineWidth,
      lineColor,
    } = super.getDetails()

    // Save current context state to avoid transformations affecting other drawings
    ctx.save()
    // Move context to the circle's center
    ctx.translate(x, y)

    // Apply rotation if needed
    if (rotation !== 0) {
      ctx.rotate(rotation * Math.PI / 180) // Convert to radians
    }

    // Apply fill style if enabled
    if (opacity > 0) {
      ctx.fillStyle = fillColor
      ctx.globalAlpha = opacity / 100 // Set the opacity
    }

    // Apply stroke style if enabled
    if (lineWidth > 0) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor
      ctx.lineJoin = 'round'
    }

    // Draw circle
    ctx.beginPath()
    ctx.ellipse(0, 0, r1, r2, 0, 0, Math.PI * 2) // Ellipse for circle (can use same radius for both axes)

    if (dashLine) {
      ctx.setLineDash([3, 5]) // Apply dashed line pattern
    } else {
      ctx.setLineDash([]) // Reset line dash if no dashLine
    }

    ctx.closePath()

    // Fill if enabled
    if (opacity > 0) {
      ctx.fill()
    }

    // Stroke if enabled
    if (lineWidth > 0) {
      ctx.stroke()
    }

    // Apply gradient if provided
    if (gradient) {
      ctx.fillStyle = gradient // Use gradient for fill
      if (opacity > 0) {
        ctx.fill() // Fill with gradient
      }
    }

    // Restore the context to avoid affecting subsequent drawings
    ctx.restore()
  }

}

export default Ellipse