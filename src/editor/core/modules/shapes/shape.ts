import Base, {BasicModuleProps} from '../base.ts'
import {HANDLER_OFFSETS} from '../handleBasics.ts'
import {OperationHandlers} from '../../../engine/selection/type'
import {rotatePoint} from '../../../lib/lib.ts'
import Rectangle, {RectangleProps} from './rectangle.ts'

export interface ShapeProps extends BasicModuleProps {
  x: number
  y: number
  enableGradient?: boolean
  gradient?: Gradient
  enableFill?: boolean
  fillColor?: FillColor
  dashLine?: string
}

class Shape extends Base {
  public x: number
  public y: number
  readonly fillColor: FillColor
  readonly enableFill: boolean

  constructor({
                x,
                y,
                fillColor,
                enableFill = true,
                ...rest
              }: ShapeProps) {
    super(rest)

    this.x = x
    this.y = y
    this.fillColor = fillColor as FillColor
    this.enableFill = enableFill
  }

  public getDetails<T extends boolean>(
    includeIdentifiers: T = true as T,
  ): T extends true ?
    ShapeProps :
    Omit<ShapeProps, 'id' & 'layer'> {

    return {
      ...super.getDetails(includeIdentifiers),
      fillColor: this.fillColor,
      enableFill: this.enableFill,
      x: this.x,
      y: this.y,
    } as T extends true ? ShapeProps : Omit<ShapeProps, 'id' & 'layer'>
  }

  move(x: number, y: number) {
    this.x += x
    this.y += y
  }

  public getOperators(
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    boundingRect: CenterBasedRect,
    moduleOrigin: ModuleProps,
  ): OperationHandlers[] {
    const {x: cx, y: cy, width, height} = boundingRect
    // const id = this.id
    const {id, rotation} = this

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
        rotation,
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
        moduleOrigin,
        module: new Rectangle(currentModuleProps),
      }
    })

    return handlers
  }

  public isInsideRect(outer: BoundingRect): boolean {
    const inner = this.getBoundingRect()

    return (
      inner.left >= outer.left &&
      inner.right <= outer.right &&
      inner.top >= outer.top &&
      inner.bottom <= outer.bottom
    )
  }
}

export default Shape