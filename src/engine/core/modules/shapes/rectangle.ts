/* eslint-disable @typescript-eslint/no-empty-object-type */
import Shape, {ShapeProps} from './shape.ts'

export interface RectangleProps extends ShapeProps {}

class Rectangle extends Shape {
  constructor({
                ...rest
              }: RectangleProps) {
    super(rest)
  }

  public getDetails<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' | 'layer'> {
    return super.getDetails(includeIdentifiers) as T extends true ? RectangleProps : Omit<RectangleProps, 'id' | 'layer'>
  }

  public getBoundingRect(): BoundingRect {
    return super.getBoundingRect()
  }

}

export default Rectangle