import Shape, {ShapeProps} from './shape.ts'
import {generateBoundingRectFromRotatedRect} from '../../utils.ts'
import {OperationHandlers} from '../../../editor/selection/type'
import {getCursor, rotatePoint} from '../../../lib/lib.ts'
import {SnapPointData} from '../../../editor/type'

export interface RectangleProps extends ShapeProps {
  width: number
  height: number
  radius?: number
}

class Rectangle extends Shape {
  // readonly type = 'rectangle'
  private width: number
  private height: number
  private radius: number

  constructor({
                width,
                height,
                radius = 0,
                ...rest
              }: Omit<RectangleProps, 'type'>) {
    super({type: 'rectangle', ...rest})
    this.width = width!
    this.height = height!
    this.radius = radius!
  }

  public getDetails<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'> {
    return {
      width: this.width,
      height: this.height,
      ...super.getDetails(includeIdentifiers),
    } as T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>
  }

  public getBoundingRect() {
    const {x: cx, y: cy, width, height, rotation} = this

    const x = cx - width / 2
    const y = cy - height / 2

    if (rotation === 0) {
      return {
        x,
        y,
        width,
        height,
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
        cx,
        cy,
      }
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
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

  public getOperators(scale: number, dpr: DPR) {
    const {
      x: cx,
      y: cy,
      id,
      width,
      height,
      rotation,
    } = this

    const localHandleOffsets = [
      {
        type: 'rotate',
        name: 'rotate-tl',
        x: 0,
        y: 0,
        offsetX: -0.5,
        offsetY: -0.5,
        originCursor: 'rotate',
        cursor: 'rotate',
      }, // left-center
      {
        type: 'rotate',
        name: 'rotate-tr',
        x: 1,
        y: 0,
        offsetX: 0.5,
        offsetY: -0.5,
        originCursor: 'rotate',
        cursor: 'rotate',
      }, // left-center
      {
        type: 'rotate',
        name: 'rotate-br',
        x: 1,
        y: 1,
        offsetX: 0.5,
        offsetY: 0.5,
        originCursor: 'rotate',
        cursor: 'rotate',
      }, // left-center
      {
        type: 'rotate',
        name: 'rotate-bl',
        x: 0,
        y: 1,
        offsetX: -0.5,
        offsetY: 0.5,
        originCursor: 'rotate',
        cursor: 'rotate',
      },
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
      // left-center
    ] as const
    const resizeHandlerLen = 10
    const resizeHandlerBorderWidth = 1
    const resizeHandlerScaledWidth = (resizeHandlerLen / scale) * dpr
    const resizeHandlerScaledLineWidth = (resizeHandlerBorderWidth / scale) * dpr

    const handlers = localHandleOffsets.map((offset): OperationHandlers => {
      // Calculate the handle position in local coordinates
      const handleX = cx - width / 2 + offset.x * width
      const handleY = cy - height / 2 + offset.y * height
      let cursor: ResizeCursor = offset.cursor as ResizeCursor
      let len
      let lineWidth = 0
      let rotated

      if (offset.type === 'resize') {
        rotated = rotatePoint(handleX, handleY, cx, cy, rotation)
        cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
        len = resizeHandlerScaledWidth
        lineWidth = resizeHandlerScaledLineWidth
      } else {
        const currentRotateHandlerCenterX =
          handleX + offset.offsetX * resizeHandlerScaledWidth
        const currentRotateHandlerCenterY =
          handleY + offset.offsetY * resizeHandlerScaledWidth
        // console.log(currentRotateHandlerCenterX, currentRotateHandlerCenterY);
        rotated = rotatePoint(
          currentRotateHandlerCenterX,
          currentRotateHandlerCenterY,
          cx,
          cy,
          rotation,
        )
        len = resizeHandlerScaledWidth * 2
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
          size: len,
          lineWidth,
          // position: offset.name,
          rotation,
        },
      }
    })

    return handlers
  }

  public getSnapPoints(): SnapPointData[] {
    const {x: cx, y: cy, width, height, id} = this
    const halfWidth = width / 2
    const halfHeight = height / 2

    // Define basic snap points: center, corners, and edge centers
    const points: SnapPointData[] = [
      {id, x: cx, y: cy, type: 'center'},
      {id, x: cx - halfWidth, y: cy - halfHeight, type: 'corner-tl'},
      {id, x: cx + halfWidth, y: cy - halfHeight, type: 'corner-tr'},
      {id, x: cx + halfWidth, y: cy + halfHeight, type: 'corner-br'},
      {id, x: cx - halfWidth, y: cy + halfHeight, type: 'corner-bl'},
      {id, x: cx, y: cy - halfHeight, type: 'edge-top'},
      {id, x: cx + halfWidth, y: cy, type: 'edge-right'},
      {id, x: cx, y: cy + halfHeight, type: 'edge-bottom'},
      {id, x: cx - halfWidth, y: cy, type: 'edge-left'},
    ]

    return points
  }

  render(ctx: CanvasRenderingContext2D): void {
    // const { x, y, width, height, fillColor } = this.getDetails();
    const {
      // width,
      // height,
      radius,
    } = this
    const {x, y, width, height, rotation, opacity, fillColor, lineWidth, lineColor, dashLine} = this.getDetails()

    const LocalX = width / 2
    const LocalY = height / 2

    // Save current context state to avoid transformations affecting other drawings
    ctx.save()

    // Move context to the rectangle's center (Direct center point at x, y)
    ctx.translate(x, y)

    // Apply rotation if needed
    if (rotation! > 0) {
      ctx.rotate(rotation! * Math.PI / 180)
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
      ctx.lineJoin = 'miter'
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