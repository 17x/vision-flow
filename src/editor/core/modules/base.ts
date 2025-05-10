import Editor from '../../engine/editor.ts'
import {RotateHandler} from '../../engine/selection/type'

export interface BasicModuleProps {
  id: UID
  layer: number
  // type: keyof ModuleTypeMap
  enableLine?: boolean
  lineColor: HexColor
  lineWidth: number
  opacity: Opacity
  shadow?: boolean
  rotation?: number
}
// type RequiredBaseProps = Required<BasicModuleProps,''>
class Base {
  readonly id: UID
  readonly type: string
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

  static applyRotating(this: Editor, shiftKey: boolean) {
    const {mouseDownPoint, mouseMovePoint, scale, dpr, offset} = this.viewport
    const {module: {rotation}, moduleOrigin} = this._rotatingOperator as RotateHandler
    const {x, y} = moduleOrigin

    const downX = (mouseDownPoint.x - offset.x / dpr) / scale * dpr
    const downY = (mouseDownPoint.y - offset.y / dpr) / scale * dpr
    const moveX = (mouseMovePoint.x - offset.x / dpr) / scale * dpr
    const moveY = (mouseMovePoint.y - offset.y / dpr) / scale * dpr

    const startAngle = Math.atan2(downY - y, downX - x)
    const currentAngle = Math.atan2(moveY - y, moveX - x)

    let rotationDelta = (currentAngle - startAngle) * (180 / Math.PI)

    if (shiftKey) {
      rotationDelta = Math.round(rotationDelta / 15) * 15
    }

    let newRotation = (rotation + rotationDelta) % 360
    if (newRotation < 0) newRotation += 360

    return newRotation
  }

}

export default Base