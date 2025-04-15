import Base, {BasicModuleProps} from '../base.ts'

export interface ShapeProps extends BasicModuleProps {
  x: number
  y: number
  enableGradient?: boolean
  gradient?: Gradient
  enableFill?: boolean
  fillColor?: FillColor
  dashLine?: string
}

class Shape extends Base {
  public x: number
  public y: number
  readonly fillColor: FillColor
  readonly enableFill: boolean

  constructor({
                x,
                y,
                fillColor,
                enableFill = true,
                ...rest
              }: ShapeProps) {
    super(rest)

    this.x = x
    this.y = y
    this.fillColor = fillColor as FillColor
    this.enableFill = enableFill
  }

  public getDetails<T extends boolean>(
    includeIdentifiers: T = true as T,
  ): T extends true ?
    ShapeProps :
    Omit<ShapeProps, 'id' & 'layer'> {

    return {
      ...super.getDetails(includeIdentifiers),
      fillColor: this.fillColor,
      enableFill: this.enableFill,
      x: this.x,
      y: this.y,
    } as T extends true ? ShapeProps : Omit<ShapeProps, 'id' & 'layer'>
  }

  move(x: number, y: number) {
    this.x += x
    this.y += y
  }
}

export default Shape