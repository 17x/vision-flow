import Base, {BasicModuleProps} from "../base.ts"

export interface ShapeProps extends BasicModuleProps {
  x: number
  y: number

  enableGradient?: boolean
  gradient?: Gradient

  enableFill: boolean
  fillColor: FillColor

  rotation: number
}

class Shape extends Base {
  readonly x: number
  readonly y: number
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
    this.fillColor = fillColor
    this.enableFill = enableFill
  }

  public getDetails(): ShapeProps {
    return {
      ...this.getSize(),
      fillColor: this.fillColor,
      enableFill: this.enableFill,
      x: this.x,
      y: this.y,
      ...super.getDetails(),
    }
  }

  public getSize(): Size {
    return {
      width: 100,
      height: 100,
    }
  }

  public getBoundingRect(): BoundingRect {
    const {
      x, y
    } = this
    const {
      width,
      height
    } = this.getSize()

    return {
      x,
      y,
      width,
      height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      centerX: x + width / 2,
      centerY: y + height / 2,
    }
  }
}

export default Shape