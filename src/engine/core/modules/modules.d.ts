import Rectangle, {RectangleProps} from "./shapes/Rectangle.ts";
import RoundedRectangle, {RoundedRectangleProps} from "./shapes/RoundedRectangle.ts";

declare global {
  type ModuleTypeMap = {
    'rectangle': Rectangle
    'roundedRectangle': RoundedRectangle
  }

  type ModuleProps = RectangleProps | RoundedRectangleProps

  type ModuleNames = keyof ModuleTypeMap
  // type ModuleNameList = ModuleNames[]
  type Modules = Rectangle | RoundedRectangle
}
export {}
