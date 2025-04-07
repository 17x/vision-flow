import Base, {BasicModuleProps} from "../base.ts"
import {generateBoundingRectFromRotatedRect} from "../../utils.ts"

export interface ShapeProps extends BasicModuleProps {
  x: number
  y: number
  width: number
  height: number
  enableGradient?: boolean
  gradient?: Gradient

  enableFill?: boolean
  fillColor?: FillColor

  dashLine?: string
  rotation: number
}

class Shape extends Base {
  readonly x: number
  readonly y: number
  width: number
  height: number
  readonly fillColor: FillColor
  readonly enableFill: boolean

  constructor({
                x,
                y,
                fillColor,
                enableFill = true,
                width,
                height,
                ...rest
              }: ShapeProps) {
    super(rest)

    this.x = x
    this.y = y
    this.width = width!
    this.height = height!
    this.fillColor = fillColor as FillColor
    this.enableFill = enableFill
  }

  public getDetails(): ShapeProps {
    return {
      ...this.getSize(),
      fillColor: this.fillColor,
      enableFill: this.enableFill,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      ...super.getDetails(),
    }
  }

  public getSize(): Size {
    return {
      width: 0,
      height: 0,
    }
  }

  getBoundingRect() {
    const {x: centerX, y: centerY, width, height, rotation} = this

    const x = centerX - width / 2
    const y = centerY - height / 2

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
        centerX,
        centerY,
      }
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }
}

export default Shape