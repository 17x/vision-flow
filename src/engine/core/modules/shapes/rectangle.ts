import Shape, {ShapeProps} from "./shape.ts";

export interface RectangleProps extends ShapeProps {
  width: number;
  height: number;
}

class Rectangle extends Shape {
  readonly width: number;
  readonly height: number;

  constructor({
                width,
                height,
                ...rest
              }: RectangleProps) {
    super(rest);
    this.width = width!;
    this.height = height!;
  }

  public getDetails(): RectangleProps {
    return {
      width: this.width,
      height: this.height, ...super.getDetails()
    };
  }
}

export default Rectangle;