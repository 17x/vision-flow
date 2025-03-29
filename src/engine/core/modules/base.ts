export interface BasicModuleProps {
  id: UID
  type: ModuleNames

  enableLine?: boolean
  lineColor: HexColor
  lineWidth: number

  opacity?: Opacity
  shadow?: boolean
  position?: Position
  layer: number

  rotation: number
}

class Base {
  readonly id: UID;
  readonly type: ModuleNames
  private readonly enableLine: boolean;
  private readonly lineWidth: number;
  private readonly lineColor: HexColor;
  private readonly opacity: Opacity;
  private readonly position: Position;
  private readonly rotation: Rotation;
  private readonly shadow: Shadow;
  readonly layer: number;

  constructor({
                id,
                type,
                lineColor,
                lineWidth,
                opacity,
                position,
                layer = 1,
                rotation = 0,
                shadow = false,
                enableLine = true,
              }: BasicModuleProps) {
    this.id = id
    this.type = type
    this.enableLine = enableLine;
    this.lineColor = lineColor;
    this.lineWidth = lineWidth;
    this.opacity = opacity!;
    this.position = position!;
    this.rotation = rotation;
    this.shadow = shadow;
    this.layer = layer;
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
      position: this.position,
      layer: this.layer,
      rotation: this.rotation,
    };
  }
}

export default Base;