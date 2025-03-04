export interface BasicModuleProps {
  id: UID
  type: ModuleNames
  lineColor: HexColor
  showLine?: boolean
  opacity?: Opacity
  shadow?: boolean
  position?: Position
  rotation?: number
}

class Base {
  private readonly lineColor: HexColor;
  private readonly showLine: boolean;
  private readonly opacity: Opacity;
  private readonly position: Position;
  private readonly rotation: Rotation;
  private readonly shadow: Shadow;
  private readonly type: ModuleNames

  constructor({
                type,
                lineColor,
                opacity,
                position,
                rotation = 0,
                shadow = false,
                showLine = true,
              }: BasicModuleProps) {
    this.type = type
    this.lineColor = lineColor;
    this.opacity = opacity!;
    this.position = position!;
    this.rotation = rotation;
    this.shadow = shadow;
    this.showLine = showLine;
  }

  protected getDetails() {
    return {
      type: this.type,
      lineColor: this.lineColor,
      opacity: this.opacity,
      position: this.position,
      rotation: this.rotation,
      shadow: this.shadow,
      showLine: this.showLine,
    };
  }
}

export default Base;