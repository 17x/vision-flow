import Rectangle from "../core/modules/shapes/Rectangle.ts";

const generatorModuleByType = <T extends ModuleNames>(
  id: string,
  type: T,
  {x, y, width, height}: { x: number, y: number, width: number, height: number }
): ModuleTypeMap[T] => {
  if (type === "rectangle") {
    return new Rectangle({
      type,
      id,
      /* x: Math.random() * 100,
       y: Math.random() * 50,
       width: Math.random() * 100,
       height: Math.random() * 50,*/
      x,
      y,
      width,
      height,
      lineColor: "000",
      fillColor: "000000",
      opacity: 100,
      shadow: false,
    });
  }

  if (type === "roundedRectangle") {
    // return new RoundedRectangle({
    //   type,
    //   id,
    //   width: 100,
    //   height: 50,
    //   lineColor: '000', fillColor: '000000', opacity: 100, shadow: false
    // })
  }
};

export default generatorModuleByType;
