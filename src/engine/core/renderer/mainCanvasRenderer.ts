import {TextRenderProps} from './type'
import Rectangle from '../modules/shapes/rectangle.ts'

interface RenderProps {
  ctx: CanvasRenderingContext2D
  frame: Rectangle
  modules: Map<string, ModuleType>
}

const render = ({ctx, modules, frame}: RenderProps): void => {
  frame.render(ctx)

  modules.forEach((module) => {
      // console.log(module)
      module.render(ctx)
    },
  )
}
/*
const textRender = (ctx: CanvasRenderingContext2D, texts: TextRenderProps[]): void => {
  ctx.font = '100px sans-serif'
  ctx.textBaseline = 'middle'
  texts.forEach(({id, x, y, width, height}) => {
    ctx.save()

    ctx.translate(x, y)

    ctx.fillText(id, x - width / 2, y - height / 2, 100)

    ctx.restore()
  })
}*/

export default render