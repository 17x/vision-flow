import Base, {BasicModuleProps} from "../base.ts"

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
    const {x: centerX, y: centerY, width, height, rotation} = this;

    const x = centerX - width / 2;
    const y = centerY - height / 2;

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
      };
    }

    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
    const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);

    const rectX = centerX - rotatedWidth / 2;
    const rectY = centerY - rotatedHeight / 2;

    return {
      x: rectX,
      y: rectY,
      width: rotatedWidth,
      height: rotatedHeight,
      left: rectX,
      top: rectY,
      right: rectX + rotatedWidth,
      bottom: rectY + rotatedHeight,
      centerX,
      centerY,
    };
  }
}

export default Shape