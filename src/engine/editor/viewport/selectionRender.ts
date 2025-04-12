import {CircleRenderProps, RectangleRenderProps} from '../../core/renderer/type'
import Rectangle from '../../core/modules/shapes/rectangle.ts'
import rectRender from '../../core/renderer/rectRender.ts'
import circleRender from '../../core/renderer/circleRender.ts'
import {drawCrossLine} from '../../lib/lib.ts'
import Editor from '../editor.ts'

function selectionRender(this: Editor) {
  if (this.moduleMap.size === 0) return
  const {selectionCTX: ctx, dpr, offset, worldRect, scale: scale, mouseMovePoint} = this.viewport
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
    // console.log(module)
    const {
      x, y, width, height, rotation, lineWidth,
    } = (module as Rectangle).getDetails()
    const centerPointRect = {
      x,
      y,
      width: centerPointWidth * 2,
      height: centerPointWidth * 2,
      fillColor: fillColor,
      lineColor: 'transparent',
      lineWidth: lineWidth / this.viewport.scale * this.viewport.dpr,
      rotation,
      opacity: 100,
    }

    const boundaryRect = {
      x,
      y,
      width,
      height,
      fillColor,
      lineColor,
      lineWidth: lineWidth / this.viewport.scale * this.viewport.dpr,
      rotation,
      opacity: 0,
      dashLine: '[3, 5]',
    }

    rects.push(boundaryRect)

    if (id !== this.hoveredModule) {
      rects.push(centerPointRect)
    }
  })

  this.operationHandlers.forEach(operation => {
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
        const rect2 = {
          ...operation.data,
          width: operation.data.size,
          height: operation.data.size,
          opacity: 100,
          // rotation: 10,
          fillColor: '#ff0000',
          lineColor: lineColor,
        }

        rects.push(rect2)
      }
        break
    }
  })

  if (this.hoveredModule) {
    const {x, y} = this.getVisibleModuleMap.get(this.hoveredModule)
    dots.push({
      x,
      y,
      lineColor: 'transparent',
      fillColor,
      r1: centerPointWidth,
      r2: centerPointWidth,
    })
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