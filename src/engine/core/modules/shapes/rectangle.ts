import Shape, {ShapeProps} from "./shape.ts"

/*export interface RectangleProps extends ShapeProps {
  width: number;
  height: number;
  radius: number;
}*/

class Rectangle extends Shape {
  readonly width: number
  readonly height: number
  readonly radius: number

  constructor({
                width,
                height,
                radius,
                ...rest
              }: RectangleProps) {
    super(rest)
    this.width = width!
    this.height = height!
    this.radius = radius!
  }

  public getDetails(): RectangleProps {
    return {
      width: this.width,
      height: this.height,
      radius: this.radius,
      ...super.getDetails()
    }
  }
}

export default Rectangle