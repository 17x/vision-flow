import {BasicModuleProps} from "./modules/base.ts";
// import Rectangle from "./modules/shapes/Rectangle.ts";
// import Renderer from "../renderer";

type Module = BasicModuleProps;

interface RenderProps {
  ctx: CanvasRenderingContext2D
  modules: Module[]
}

type RenderTypes = 'line' | 'curve' | 'text'

interface RenderItem<T extends RenderTypes> {
  type: T
  data: any
}

const render = ({ctx, modules}: RenderProps): void => {
  // console.log(ctx, modules)
  const lineQueue: RenderItem<'line'>[] = []
  const curveQueue: RenderItem<'curve'>[] = []
  const textQueue: RenderItem<'text'>[] = []

  modules.forEach((module: Module) => {
    // console.log(module.type)

    if (module.type === 'rectangle') {
      lineQueue.push({
        type: 'line',
        data: 1
      })


      textQueue.push({type: 'text', data: '998'})
    }
  })

  ctx.fillStyle = '#000'
  // line
  lineQueue.forEach(item => {
    ctx.moveTo(100, 100)
    ctx.lineTo(200, 100)
    ctx.lineTo(200, 200)
    ctx.lineTo(100, 200)
    ctx.lineTo(100, 100)
    // ctx.lineTo(100, 100)
    ctx.stroke()
  })

  ctx.font = '24px sans-serif'
  textQueue.forEach((item) => {
    ctx.fillText('14567890abcdefg', 100, 50, 200)
  })


}

const a1: ModuleNames = 1
export default render