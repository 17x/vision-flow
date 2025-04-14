import Rectangle, {RectangleProps} from './shapes/rectangle.ts'
import Ellipse, {EllipseProps} from './shapes/ellipse.ts'
import {ShapeProps} from './shapes/shape.ts'

declare global {
  type ModuleTypeMap = {
    'rectangle': Rectangle
    'ellipse': Ellipse
  }
  type ModulePropsMap = {
    'rectangle': RectangleProps
    'ellipse': EllipseProps
  }
  type ModuleProps = RectangleProps | EllipseProps
  type PropsWithoutIdentifiers<T extends keyof ModulePropsMap> = Omit<ModulePropsMap[T], 'id' & 'layer'>
  type ModuleNames = keyof ModuleTypeMap
  type ModuleType = Rectangle | RoundedRectangle | Connector
  type ModuleMap = Map<UID, ModuleType>
}

export {}
