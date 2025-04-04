import {CircleRenderProps, RectangleRenderProps} from "../../core/renderer/type"
import Rectangle from "../../core/modules/shapes/rectangle.ts"
import rectRender from "../../core/renderer/rectRender.ts"
import circleRender from "../../core/renderer/circleRender.ts"
import Viewport from "./viewport.ts";
import {drawCrossLine, getBoxControlPoints} from "../../lib/lib.ts";

function selectionRender(this: Viewport) {
  const {selectionCTX: ctx, editor, dpr, offset, rect, virtualRect, zoom: scale, mouseMovePoint} = this
  const {selectionManager} = editor
  const enableRotationHandle = selectionManager.selectedModules.size === 1

  const BatchDrawer = (modules: ModuleMap) => {
    const l = selectionManager.resizeHandleSize / 2
    const rects: RectangleRenderProps[] = []
    const dots: CircleRenderProps[] = []
    const fillColor = "#5491f8"
    const lineColor = "#5491f8"
    // const dotLineWidth = 1

    if (enableRotationHandle) {
      // selectionManager.ctx.translate(item.x + item.size / 2, item.y + item.size / 2); // Move origin to center of item
      // selectionManager.ctx.rotate(item.rotation); // Apply rotation
    }

    modules.forEach((module) => {
      const {
        x, y, width, height, rotation, lineWidth
      } = (module as Rectangle).getDetails()
      const points = getBoxControlPoints(x, y, width, height, rotation)

      dots.push(...points.map(point => ({
        ...point,
        r1: l,
        r2: l,
        fillColor,
        lineColor: '#fff',
      })))

      rects.push({
        x,
        y,
        width,
        height,
        fillColor,
        lineColor,
        lineWidth,
        rotation,
        opacity: 0,
        dashLine: 'dash'
      })
    })

    rectRender(ctx, rects)
    circleRender(ctx, dots)

    if (this.enableCrossLine && this.drawCrossLine) {
      drawCrossLine({
        ctx,
        mousePoint: mouseMovePoint,
        scale,
        dpr,
        offset,
        virtualRect
      })
    }
  }

  if (selectionManager.isSelectAll) {
    BatchDrawer(selectionManager.editor.visibleModuleMap)
  } else {
    const selectedModulesMap: ModuleMap = new Map()

    selectionManager.selectedModules.forEach(id => {
      selectionManager.editor.visibleModuleMap.forEach((module) => {
        if (module.id === id) {
          selectedModulesMap.set(module.id, module)
        }
      })
    })

    BatchDrawer(selectedModulesMap)
  }
}

export default selectionRender