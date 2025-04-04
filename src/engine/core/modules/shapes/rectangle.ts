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

  public getBoundingRect(): BoundingRect {
    const { x: centerX, y: centerY, width, height, rotation } = this;

    // Convert rotation to radians
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Calculate the rotated bounding box size
    const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
    const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);

    // Top-left corner of the bounding rectangle
    const x = centerX - rotatedWidth / 2;
    const y = centerY - rotatedHeight / 2;

    return {
      x,
      y,
      width: rotatedWidth,
      height: rotatedHeight,
      top: y,
      bottom: y + rotatedHeight,
      left: x,
      right: x + rotatedWidth,
      centerX,
      centerY,
    };
  }

}

export default Rectangle