import Shape, {ShapeProps} from './shape.ts'
import {RenderPropsMap} from '../../renderer/type'

// import {RectangleRenderProps, RenderPropsMap} from '../../renderer/type'

export interface RectangleProps extends ShapeProps {}

class Rectangle extends Shape {
  readonly type = 'rectangle'

  constructor({
                ...rest
              }: RectangleProps) {
    super(rest)
    // this.type = type
  }

  public getDetails<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' | 'layer'> {
    return super.getDetails(includeIdentifiers) as T extends true ? RectangleProps : Omit<RectangleProps, 'id' | 'layer'>
  }

  public getBoundingRect(): BoundingRect {
    return super.getBoundingRect()
  }

  public hitTest(point: Point, borderPadding = 5): 'inside' | 'border' | null {
    const {x: cx, y: cy, width, height, rotation = 0} = this

    const cos = Math.cos(-rotation)
    const sin = Math.sin(-rotation)

    const dx = point.x - cx
    const dy = point.y - cy

    // Rotate the point into the rectangle's local space
    const localX = dx * cos + dy * sin
    const localY = -dx * sin + dy * cos

    const halfWidth = width / 2
    const halfHeight = height / 2

    const withinX = localX >= -halfWidth && localX <= halfWidth
    const withinY = localY >= -halfHeight && localY <= halfHeight

    if (withinX && withinY) {
      const nearLeft = Math.abs(localX + halfWidth) <= borderPadding
      const nearRight = Math.abs(localX - halfWidth) <= borderPadding
      const nearTop = Math.abs(localY + halfHeight) <= borderPadding
      const nearBottom = Math.abs(localY - halfHeight) <= borderPadding

      if (nearLeft || nearRight || nearTop || nearBottom) {
        return 'border'
      }
      return 'inside'
    }

    return null
  }

  public getRenderData(): RenderPropsMap {
    // const {x, y, fillColor, r1, r2} = this
    const {
      x,
      y,
      width,
      height,
      enableFill,
      enableLine,
      opacity,
      lineWidth,
      fillColor,
      lineColor,
      rotation,
      gradient,
      radius,
      layer,
    } = this
    const rects: RectangleRenderProps[] = []

    if ((enableFill && opacity > 0) || enableLine) {
      rects.push(
        {
          ...super.getDetails(),
          x,
          y,
          width,
          height,
          enableFill,
          enableLine,
          opacity,
          lineWidth,
          fillColor,
          lineColor,
          rotation,
          gradient,
          // radius,
        },
      )
    }

    return {
      rects,
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // const { x, y, width, height, fillColor } = this.getDetails();
    const {
      // width,
      // height,
      radius,
    } = this
    const {x, y, width, height, rotation, opacity, fillColor, lineWidth, lineColor, dashLine} = super.getDetails()

    const LocalX = width / 2
    const LocalY = height / 2

    // Save current context state to avoid transformations affecting other drawings
    ctx.save()

    // Move context to the rectangle's center (Direct center point at x, y)
    ctx.translate(x, y)

    // Apply rotation if needed
    if (rotation > 0) {
      ctx.rotate(rotation * Math.PI / 180)
    }

    // Apply fill style if enabled
    if (opacity > 0) {
      ctx.fillStyle = fillColor as string
      ctx.globalAlpha = opacity / 100 // Set the opacity
    }

    // Apply stroke style if enabled
    if (lineWidth > 0) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor
      ctx.lineJoin = 'round'
    }

    // return
    // Draw a rounded rectangle or regular rectangle
    ctx.beginPath()

    if (dashLine) {
      ctx.setLineDash([3, 5])
    }

    if (radius > 0) {
      // Use arcTo for rounded corners
      ctx.moveTo(-LocalX + radius, -LocalY)
      ctx.arcTo(LocalX, -LocalY, LocalX, LocalY, radius)
      ctx.arcTo(LocalX, LocalY, -LocalX, LocalY, radius)
      ctx.arcTo(-LocalX, LocalY, -LocalX, -LocalY, radius)
      ctx.arcTo(-LocalX, -LocalY, LocalX, -LocalY, radius)
    } else {
      // For square/rectangular modules with no rounded corners
      ctx.rect(-LocalX, -LocalY, width, height)
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

    /*   if (gradient) {
         // Implement gradient rendering (as needed)
       }*/

    // Restore the context to avoid affecting subsequent drawings
    ctx.restore()
  }
}

export default Rectangle