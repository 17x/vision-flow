import {CircleRenderProps, RectangleRenderProps} from '../../core/renderer/type'
import Rectangle from '../../core/modules/shapes/rectangle.ts'
import rectRender from '../../core/renderer/rectRender.ts'
import circleRender from '../../core/renderer/circleRender.ts'
import {drawCrossLine, getBoxControlPoints} from '../../lib/lib.ts'
import Editor from '../editor.ts'

function selectionRender(this: Editor, idSet: Set<UID>) {
  // if (!idSet || idSet.size === 0) return

  const {selectionCTX: ctx, dpr, offset, worldRect, scale: scale, mouseMovePoint} = this.viewport
  // const modules = this.getModulesByIdSet(idSet)
  console.log([...this.operationHandlers])
  const rects: RectangleRenderProps[] = []
  const dots: CircleRenderProps[] = []
  const fillColor = '#5491f8'
  const lineColor = '#5491f8'

  this.operationHandlers.forEach(operation => {
    switch (operation.type) {
      case 'resize':
        // console.log(operation.data)
        const rect = {
          ...operation.data,
          height: operation.data.width,
          opacity: 80,
          // rotation: 10,
          fillColor,
          lineColor: '#fff',
        }
        // console.log(rect)
        rects.push(rect)
        break
    }
  })

  // console.log(modules.size)
  this.getVisibleSelectedModuleMap.forEach((module) => {
    const {
      x, y, width, height, rotation, lineWidth,
    } = (module as Rectangle).getDetails()
    /*const points = getBoxControlPoints(x, y, width, height, rotation)

    dots.push(...points.map(point => ({
      ...point,
      r1: l,
      r2: l,
      fillColor,
      lineColor: '#fff',
    })))
*/
    rects.push({
      x,
      y,
      width,
      height,
      fillColor,
      lineColor,
      lineWidth: lineWidth / this.viewport.scale * this.viewport.dpr,
      rotation,
      opacity: 0,
      // dashLine: 'dash',
    })
  })

  rectRender(ctx, rects)
  circleRender(ctx, dots)

  // if (this.enableCrossLine && this.drawCrossLine) {
  if (this.viewport.enableCrossLine && this.viewport.drawCrossLine) {
    drawCrossLine({
      ctx,
      mousePoint: mouseMovePoint,
      scale,
      dpr,
      offset,
      worldRect: worldRect,
    })
  }
}

export default selectionRender