import Shape, {ShapeProps} from "./shape.ts";

export interface RectangleProps extends ShapeProps {
  width: number;
  height: number;
}

class Rectangle extends Shape {

  constructor({...rest}: RectangleProps) {
    super(rest);
  }

  static render(ctx, module) {
    // ctx.fillStyle = module.getFillStyle(module.getFillStyle());
  }

  protected getDetails() {
    return {
      ...super.getDetails(),
      /*lineColor: this.lineColor,
      opacity: this.opacity,
      position: this.position,
      rotation: this.rotation,
      shadow: this.shadow,
      showLine: this.showLine,*/
    };
  }
}

export default Rectangle;