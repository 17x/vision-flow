import Shape from "./shape.ts";
import {RectangleProps} from "./Rectangle.ts";

export interface RoundedRectangleProps extends RectangleProps {

}

class RoundedRectangle extends Shape {

  constructor({...rest}: RoundedRectangleProps) {
    super(rest);
  }

  public getDetails() {
    return {
      ...super.getDetails(),
    };
  }

}

export default RoundedRectangle;