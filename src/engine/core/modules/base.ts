export interface BasicModuleProps {
  id: UID
  layer: number
  type: string
  enableLine?: boolean
  lineColor: HexColor
  lineWidth: number
  opacity: Opacity
  shadow?: boolean
  rotation?: number
}

class Base {
  readonly id: UID
  protected type: string
  protected enableLine: boolean
  protected lineWidth: number
  protected lineColor: HexColor
  protected opacity: Opacity
  public rotation: Rotation
  protected shadow: Shadow
  readonly layer: number

  constructor({
                id,
                lineColor,
                lineWidth = 1,
                opacity = 100,
                type,
                layer = 1,
                rotation = 0,
                shadow = false,
                enableLine = true,
              }: BasicModuleProps) {
    this.id = id
    this.layer = layer
    this.enableLine = enableLine
    this.lineColor = lineColor
    this.lineWidth = lineWidth
    this.opacity = opacity!
    this.rotation = rotation
    this.shadow = shadow
    this.type = type
  }

  protected getDetails<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? BasicModuleProps : Omit<BasicModuleProps, 'id' & 'layer'> {
    const base = {
      type: this.type,
      enableLine: this.enableLine,
      lineColor: this.lineColor,
      lineWidth: this.lineWidth,
      opacity: this.opacity,
      shadow: this.shadow,
      rotation: this.rotation,
    }

    if (includeIdentifiers) {
      return {
        ...base,
        id: this.id,
        layer: this.layer,
      } as BasicModuleProps
    }

    return base as Omit<BasicModuleProps, 'id' & 'layer'>
  }

  protected getBoundingRect(): BoundingRect {
    return {bottom: 0, cx: 0, cy: 0, left: 0, right: 0, top: 0, x: 0, y: 0, width: 0, height: 0}
  }

  protected render(_ctx: CanvasRenderingContext2D): void {
    return undefined
  }

}

export default Base