export interface BasicModuleProps {
  id: UID
  type: ModuleNames

  enableLine?: boolean
  lineColor: HexColor
  lineWidth: number

  opacity: Opacity
  shadow: boolean
  position?: Point
  layer: number

  rotation: number
}

class Base {
  readonly id: UID
  readonly type: ModuleNames
  private readonly enableLine: boolean
  private readonly lineWidth: number
  private readonly lineColor: HexColor
  private readonly opacity: Opacity
  private readonly position: Point
  readonly rotation: Rotation
  private readonly shadow: Shadow
  readonly layer: number

  constructor({
                id,
                type,
                lineColor,
                lineWidth = 1,
                opacity = 100,
                position,
                layer = 1,
                rotation = 0,
                shadow = false,
                enableLine = true,
              }: BasicModuleProps) {
    this.id = id
    this.type = type
    this.enableLine = enableLine
    this.lineColor = lineColor
    this.lineWidth = lineWidth
    this.opacity = opacity!
    this.position = position!
    this.rotation = rotation
    this.shadow = shadow
    this.layer = layer
  }

  protected getDetails(): BasicModuleProps {
    return {
      id: this.id,
      type: this.type,

      enableLine: this.enableLine,
      lineColor: this.lineColor,
      lineWidth: this.lineWidth,

      opacity: this.opacity,
      shadow: this.shadow,
      // position: this.position,
      layer: this.layer,
      rotation: this.rotation,
    }
  }

  protected getBoundingRect(): BoundingRect {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      centerX: 0,
      centerY: 0
    }
  }
}

export default Base