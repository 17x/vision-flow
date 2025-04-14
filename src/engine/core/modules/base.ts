import {RenderPropsMap} from '../renderer/type'

export interface BasicModuleProps {
  id: UID
  layer: number
  // type: ModuleNames
  enableLine?: boolean
  lineColor: HexColor
  lineWidth: number

  opacity: Opacity
  shadow?: boolean
  // position?: Point
  rotation?: number
}

class Base {
  readonly id: UID
  readonly enableLine: boolean
  private readonly lineWidth: number
  private readonly lineColor: HexColor
  readonly opacity: Opacity
  readonly rotation: Rotation
  private readonly shadow: Shadow
  readonly layer: number

  constructor({
                id,
                lineColor,
                lineWidth = 1,
                opacity = 100,
                // position,
                layer = 1,
                rotation = 0,
                shadow = false,
                enableLine = true,
              }: BasicModuleProps) {
    this.id = id
    this.enableLine = enableLine
    this.lineColor = lineColor
    this.lineWidth = lineWidth
    this.opacity = opacity!
    // this.position = position!
    this.rotation = rotation
    this.shadow = shadow
    this.layer = layer
  }

  // protected getDetails(includeIdentifiers: true): BasicModuleProps
  // protected getDetails(includeIdentifiers: false): Omit<BasicModuleProps, 'id' | 'layer'>
  protected getDetails<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? BasicModuleProps : Omit<BasicModuleProps, 'id' | 'layer'> {
    const base = {
      // type: this.type,
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

    return base as T extends true ? BasicModuleProps : Omit<BasicModuleProps, 'id' | 'layer'>
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
      cx: 0,
      cy: 0,
    }
  }

  protected getRenderData(): RenderPropsMap {
    return {}
  }
}

export default Base