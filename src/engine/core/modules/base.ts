export interface BasicModuleProps {
  id: UID
  type: ModuleNames
  lineColor: HexColor
  showLine?: boolean
  opacity?: Opacity
  shadow?: boolean
  position?: Position
  rotation?: number
  layer: number
}

class Base {
  readonly id: UID;
  readonly type: ModuleNames
  private readonly lineColor: HexColor;
  private readonly showLine: boolean;
  private readonly opacity: Opacity;
  private readonly position: Position;
  private readonly rotation: Rotation;
  private readonly shadow: Shadow;
  private readonly layer: number;

  constructor({
                id,
                type,
                lineColor,
                opacity,
                position,
                layer,
                rotation = 0,
                shadow = false,
                showLine = true,
              }: BasicModuleProps) {
    this.id = id
    this.type = type
    this.lineColor = lineColor;
    this.opacity = opacity!;
    this.position = position!;
    this.rotation = rotation;
    this.shadow = shadow;
    this.showLine = showLine;
    this.layer = layer;
  }

  protected getDetails(): BasicModuleProps {
    return {
      id: this.id,
      type: this.type,
      lineColor: this.lineColor,
      opacity: this.opacity,
      position: this.position,
      rotation: this.rotation,
      shadow: this.shadow,
      showLine: this.showLine,
      layer: this.layer
    };
  }
}

export default Base;