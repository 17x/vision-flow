import Base, {BasicModuleProps} from "../base.ts";

export interface ShapeProps extends BasicModuleProps {
  x?: number
  y?: number
  // width?: number
  // height?: number
  gradient?: Gradient
  enableGradient?: boolean
  fillColor?: HexColor
  enableFill?: boolean
}

class Shape extends Base {
  private x: number;
  private y: number;
  // private width: number;
  // private height: number;

  constructor({
                x,
                y,
                ...rest
              }: ShapeProps) {
    super(rest);

    this.x = x!;
    this.y = y!;
    // this.width = width!;
    // this.height = height!;
  }

  public getDetails(): ShapeProps {
    return {
      ...this.getSize(),
      x: this.x,
      y: this.y, ...super.getDetails(),
    };
  }

  public getSize(): Size {
    return {
      width: 100,
      height: 100,
    }
  }

  public getBoundingRect(): BoundingRect {
    const {
      x,
      y
    } = this;
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
    }
  }
}

export default Shape