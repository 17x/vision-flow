import Rectangle from "./shapes/Rectangle.ts";
import RoundedRectangle from "./shapes/RoundedRectangle.ts";

declare global {
  type ModuleTypeMap = {
    'rectangle': Rectangle
    'roundedRectangle': RoundedRectangle
  }

  type ModuleNames = keyof ModuleTypeMap
  // type ModuleNameList = ModuleNames[]
  type Modules = ModuleMap[keyof ModuleMap]
  // type ModuleList = Modules[]
}
export {}
