import {CircleRenderProps, RectangleRenderProps} from '../../core/renderer/type'
import Rectangle from '../../core/modules/shapes/rectangle.ts'
import rectRender from '../../core/renderer/rectRender.ts'
import circleRender from '../../core/renderer/circleRender.ts'
// import {drawCrossLine} from '../../lib/lib.ts'
import Editor from '../editor.ts'

function selectionRender(this: Editor) {
  if (this.moduleMap.size === 0) return
  const {selectionCTX: ctx, dpr, offset, worldRect, scale, mouseMovePoint} = this.viewport
  const rects: RectangleRenderProps[] = []
  const dots: CircleRenderProps[] = []
  const fillColor = '#5491f8'
  const lineColor = '#5491f8'
  const selected = this.getVisibleSelected
  const highlightedModules = new Set<UID>(selected)
  const centerPointWidth = 2 / this.viewport.scale * this.viewport.dpr

  if (this.hoveredModule) {
    highlightedModules.add(this.hoveredModule)
  }

  highlightedModules.forEach((id) => {
    const module = this.moduleMap.get(id)
    const {x, y, rotation} = (module as Rectangle).getDetails()
    const lineWidth = 1 / this.viewport.scale * this.viewport.dpr
    const mod = module!.getHighlightModule(lineWidth, fillColor) as ModuleInstance

    mod!.render(ctx)

    if (id !== this.hoveredModule) {
      const centerPointRect = {
        x,
        y,
        width: centerPointWidth * 2,
        height: centerPointWidth * 2,
        fillColor: fillColor,
        lineColor: 'transparent',
        lineWidth,
        rotation,
        opacity: 100,
      }
      rects.push(centerPointRect)
    }
  })

  this.operationHandlers.forEach(operation => {
    console.log(operation)
    switch (operation.type) {
      case 'resize': {
        // console.log(operation.data)
        const rect = {
          ...operation.data,
          width: operation.data.size,
          height: operation.data.size,
          opacity: 100,
          // rotation: 10,
          fillColor: '#fff',
          lineColor: lineColor,
        }
        rects.push(rect)
      }
        break
      case 'rotate': {
        /* const rect2 = {
           ...operation.data,
           width: operation.data.size,
           height: operation.data.size,
           opacity: 100,
           // rotation: 10,
           fillColor: '#ff0000',
           lineColor: lineColor,
         }

         rects.push(rect2)*/
      }
        break
    }
  })

  if (this.hoveredModule) {
    const module = this.getVisibleModuleMap.get(this.hoveredModule)

    if (module) {
      dots.push({
        x: module.x,
        y: module.y,
        lineColor: 'transparent',
        fillColor,
        r1: centerPointWidth,
        r2: centerPointWidth,
      })
    }
  }

  rectRender(ctx, rects)
  circleRender(ctx, dots)

  // if (this.enableCrossLine && this.drawCrossLine) {
  /*if (this.viewport.enableCrossLine && this.viewport.drawCrossLine) {
    drawCrossLine({
      ctx,
      mousePoint: mouseMovePoint,
      scale,
      dpr,
      offset,
      worldRect: worldRect,
    })
  }*/
}

export default selectionRender