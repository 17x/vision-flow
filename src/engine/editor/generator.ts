import Rectangle from "../core/modules/shapes/Rectangle.ts";

const generatorModuleByType = <T extends ModuleNames>(id: string, type: T): ModuleTypeMap[T] => {
  if (type === 'rectangle') {
    return new Rectangle({
      type,
      id,
      width: 100,
      height: 50,
      lineColor: '000', fillColor: '000000', opacity: 100, shadow: false
    })
  }
}

export default generatorModuleByType