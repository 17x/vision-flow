import Base, {BasicModuleProps} from "../base.ts"

export interface ConnectorProps extends BasicModuleProps {
  start?: UID
  end?: UID
  gradient?: Gradient
  enableGradient?: boolean
  fillColor?: HexColor
  enableFill?: boolean
}

class Connector extends Base {
  readonly start: UID
  readonly end: UID

  constructor({
                start,
                end,
                ...rest
              }: ConnectorProps) {
    super(rest)

    this.start = start!
    this.end = end!
    // this.width = width!;
    // this.height = height!;
  }

  public getDetails(): ConnectorProps {
    return {
      ...this.getSize(),
      ...super.getDetails(),
    }
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
    } = {x: 0, y: 1}
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

export default Connector