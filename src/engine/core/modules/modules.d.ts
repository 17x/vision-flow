import Rectangle, {RectangleProps} from "./shapes/rectangle.ts"
import Connector, {ConnectorProps} from "./connectors/connector.ts"
import RoundedRectangle, {RoundedRectangleProps} from "./shapes/roundedrectangle.ts"

declare global {
  type ModuleTypeMap = {
    'rectangle': Rectangle
    'connector': Connector
    // 'roundedRectangle': RoundedRectangle
  }

  type ShapePropsType = RectangleProps | RoundedRectangleProps
  type ConnectorProps = ConnectorProps
  type ModuleProps = ShapePropsType | ConnectorProps
  type ModuleNames = keyof ModuleTypeMap

  type ModuleType = Rectangle | RoundedRectangle | Connector
  type ModuleMap = Map<UID, ModuleType>
}
export {}
