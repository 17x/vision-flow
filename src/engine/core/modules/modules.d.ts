import Rectangle from './shapes/rectangle.ts'
import Ellipse, {EllipseProps} from './shapes/ellipse.ts'
import {ShapeProps} from './shapes/shape.ts'

declare global {
  type ModuleTypeMap = {
    'rectangle': Rectangle
    'ellipse': Ellipse
  }

  type ModuleProps = ShapeProps | EllipseProps
  type ModulePropsWithoutIdentifiers = Omit<ModuleProps, 'id' | 'layer'>
  type ModuleNames = keyof ModuleTypeMap
  type ModuleType = Rectangle | RoundedRectangle | Connector
  type ModuleMap = Map<UID, ModuleType>
}

export {}
