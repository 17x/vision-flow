import Shape, {ShapeProps} from './shape.ts'

export interface RectangleProps extends ShapeProps {}

class Rectangle extends Shape {
  constructor({
                ...rest
              }: RectangleProps) {
    super(rest)
  }

  public getDetails(): RectangleProps {
    return super.getDetails()
  }

  public getBoundingRect(): BoundingRect {
    return super.getBoundingRect()
  }

}

export default Rectangle