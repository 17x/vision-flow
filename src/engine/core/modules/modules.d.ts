import Rectangle, {RectangleProps} from './shapes/rectangle.ts'
import Ellipse, {EllipseProps} from './shapes/ellipse.ts'
import {ShapeProps} from './shapes/shape.ts'
import {ImageProps} from './shapes/image.ts'

declare global {
  type ModuleTypeMap = {
    'rectangle': Rectangle
    'ellipse': Ellipse
  }
  type ModulePropsMap = {
    'rectangle': RectangleProps
    'ellipse': EllipseProps
  }
  type ModuleProps = RectangleProps | EllipseProps | TextProps | ImageProps
  // type ModulePropsType<T extends keyof ModulePropsMap> = ModulePropsMap[T]
  type PropsWithoutIdentifiers<T extends keyof ModulePropsMap> = Omit<ModulePropsMap[T], 'id' & 'layer'>
  type ModuleNames = keyof ModuleTypeMap
  type ModuleInstance = Rectangle | Ellipse
  type ModuleMap = Map<UID, ModuleInstance>
}

export {}
