import Rectangle, {RectangleProps} from "./shapes/Rectangle.ts";
import Connector, {ConnectorProps} from "./connectors/Connector.ts";
import RoundedRectangle, {RoundedRectangleProps} from "./shapes/RoundedRectangle.ts";

declare global {
  type ModuleTypeMap = {
    'rectangle': Rectangle
    'connector': Connector
    // 'roundedRectangle': RoundedRectangle
  }

  type ShapeProps = RectangleProps | RoundedRectangleProps
  type ConnectorProps = ConnectorProps
  type ModuleProps = ShapeProps | ConnectorProps
  type ModuleNames = keyof ModuleTypeMap

  type ModuleType = Rectangle | RoundedRectangle | Connector
  type ModuleMap = Map<UID, ModuleType>
}
export {}
