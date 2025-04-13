import {ShapeProps} from './shape.ts'
import Base from '../base.ts'
import {generateBoundingRectFromRotatedRect} from '../../utils.ts'

export interface EllipseProps extends ShapeProps {
  r1: number
  r2: number
}

class Ellipse extends Base {
  readonly x: number
  readonly y: number
  r1: number
  r2: number
  readonly fillColor: FillColor
  readonly enableFill: boolean

  constructor({
                x,
                y,
                fillColor,
                enableFill = true,
                r1,
                r2,
                ...rest
              }: EllipseProps) {
    super(rest)

    this.x = x
    this.y = y
    this.r1 = r1!
    this.r2 = r2!
    this.fillColor = fillColor as FillColor
    this.enableFill = enableFill
  }

  public getDetails<T extends boolean>(
    includeIdentifiers: T = true as T,
  ): T extends true ?
    EllipseProps :
    Omit<EllipseProps, 'id' | 'layer'> {

    return {
      ...this.getSize(),
      fillColor: this.fillColor,
      enableFill: this.enableFill,
      x: this.x,
      y: this.y,
      r1: this.r1,
      height: this.r2,
      ...super.getDetails(includeIdentifiers),
    } as T extends true ? EllipseProps : Omit<EllipseProps, 'id' | 'layer'>
  }

  public getSize(): Size {

  }

  getBoundingRect() {
    const {x: cx, y: cy, r1, r2, rotation} = this

    // If no rotation, the bounding box is just the width and height based on r1 and r2
    if (rotation === 0) {
      return generateBoundingRectFromRotatedRect({
        x: cx - r1,  // Left edge
        y: cy - r2,  // Top edge
        width: r1 * 2,  // Full width (r1 * 2)
        height: r2 * 2, // Full height (r2 * 2)
      }, rotation)
    }
    /*
        // If there is rotation, we need to calculate the bounding box using rotation
        const cosRotation = Math.cos(rotation)
        const sinRotation = Math.sin(rotation)

        const width = r1 * Math.abs(cosRotation) + r2 * Math.abs(sinRotation)
        const height = r1 * Math.abs(sinRotation) + r2 * Math.abs(cosRotation)

        return {
          x: cx - width / 2,  // Left edge
          y: cy - height / 2, // Top edge
          width,  // Calculated width
          height, // Calculated height
        }*/
  }

  move(x: number, y: number) {
    this.x += x
    this.y += y
  }

}

export default Ellipse