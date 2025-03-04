import Base, {BasicModuleProps} from "../base.ts";

export interface ShapeProps extends BasicModuleProps {
  width?: number
  height?: number
  gradient?: Gradient
  enableGradient?: boolean
  fillColor?: HexColor
  enableFill?: boolean
}

class Shape extends Base {
  private width: number;
  private height: number;

  constructor({width, height, ...rest}: ShapeProps) {
    super(rest);

    this.width = width!;
    this.height = height!;
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