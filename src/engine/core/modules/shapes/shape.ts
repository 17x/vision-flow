import Base, {BasicModuleProps} from "../base.ts";

export interface ShapeProps extends BasicModuleProps {
  x?: number
  y?: number
  width?: number
  height?: number
  gradient?: Gradient
  enableGradient?: boolean
  fillColor?: HexColor
  enableFill?: boolean
}

class Shape extends Base {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor({x, y, width, height, ...rest}: ShapeProps) {
    super(rest);

    this.x = x!;
    this.y = y!;
    this.width = width!;
    this.height = height!;
  }

  public getDetails() {
    return {
      x: this.x,
      y: this.y,
      ...super.getDetails(),
    };
  }

  public getBoundingRect(): BoundingRect {
    const {x, y, width, height} = this;

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

  protected getArea(): Size {
    return {
      width: this.width,
      height: this.height
    }

    /* switch (this.shapeType) {
       case "rectangle":
         return this.size.width * this.size.height; // Area of a rectangle
       case "circle":
         return Math.PI * Math.pow(this.size.width / 2, 2); // Area of a circle (width as diameter)
       default:
         return 0; // Default case for unsupported shape types
     }*/
  }
}

export default Shape