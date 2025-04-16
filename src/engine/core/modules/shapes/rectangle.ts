import Shape, {ShapeProps} from './shape.ts'
import {generateBoundingRectFromRotatedRect} from '../../utils.ts'
import {OperationHandlers} from '../../../editor/selection/type'
import {rotatePoint} from '../../../lib/lib.ts'
import {SnapPointData} from '../../../editor/type'
import {HANDLER_OFFSETS} from '../handleBasics.ts'

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

  public getHighlightModule(lineWidth: number, lineColor: string): ModuleInstance {
    const {x, y, width, height, rotation, layer, id} = this
    return new Rectangle({
      x,
      y,
      width,
      height,
      // fillColor,
      lineColor,
      lineWidth,
      rotation,
      layer,
      id: id + 'highlight',
      opacity: 0,
    })
  }

  public getOperators(
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string }) {
    const {x: cx, y: cy, id, width, height, rotation} = this

    const handlers = HANDLER_OFFSETS.map((OFFSET): OperationHandlers => {
      // Calculate the handle position in local coordinates
      const currentCenterX = cx - width / 2 + OFFSET.x * width
      const currentCenterY = cy - height / 2 + OFFSET.y * height
      const currentModuleProps: Omit<RectangleProps, 'type'> = {
        id,
        width: 0,
        height: 0,
        x: currentCenterX,
        y: currentCenterY,
        lineColor: '',
        lineWidth: 0,
        rotation: 0,
        layer: this.layer,
        opacity: 100,
      }

      // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor

      if (OFFSET.type === 'resize') {
        const rotated = rotatePoint(currentCenterX, currentCenterY, cx, cy, rotation)
        // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
        currentModuleProps.id += 'resize'
        currentModuleProps.x = rotated.x
        currentModuleProps.y = rotated.y
        currentModuleProps.width = resizeConfig.size
        currentModuleProps.height = resizeConfig.size
        currentModuleProps.lineWidth = resizeConfig.lineWidth
        currentModuleProps.lineColor = resizeConfig.lineColor
        currentModuleProps.fillColor = resizeConfig.fillColor
      } else if (OFFSET.type === 'rotate') {
        const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth
        const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth
        const rotated = rotatePoint(
          currentRotateHandlerCenterX,
          currentRotateHandlerCenterY,
          cx,
          cy,
          rotation,
        )

        currentModuleProps.id += 'rotate'
        currentModuleProps.x = rotated.x
        currentModuleProps.y = rotated.y
        currentModuleProps.width = rotateConfig.size
        currentModuleProps.height = rotateConfig.size
        currentModuleProps.lineWidth = rotateConfig.lineWidth
        currentModuleProps.lineColor = rotateConfig.lineColor
        currentModuleProps.fillColor = rotateConfig.fillColor
      }

      return {
        id: `${id}`,
        type: OFFSET.type,
        name: OFFSET.name,
        // cursor,
        moduleOrigin: {cx, cy, width, height},
        module: new Rectangle(currentModuleProps),
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