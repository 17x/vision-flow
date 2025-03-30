import {CircleRenderProps, RectangleRenderProps} from "../../core/renderer/type"
import Rectangle from "../../core/modules/shapes/rectangle.ts"
import {getBoxControlPoints} from "./helper.ts"
import rectRender from "../../core/renderer/rectRender.ts"
import circleRender from "../../core/renderer/circleRender.ts"
import SelectionManager from "../selection/selectionManager.ts"

function selectionRender(this: SelectionManager, ctx: CanvasRenderingContext2D) {
  const enableRotationHandle = this.selectedModules.size === 1

  const BatchDrawer = (modules: ModuleMap) => {
    const l = this.resizeHandleSize / 2
    const rects: RectangleRenderProps[] = []
    const dots: CircleRenderProps[] = []
    const fillColor = "#5491f8"
    const lineColor = "#5491f8"
    // const dotLineWidth = 1

    if (enableRotationHandle) {
      // this.ctx.translate(item.x + item.size / 2, item.y + item.size / 2); // Move origin to center of item
      // this.ctx.rotate(item.rotation); // Apply rotation
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

    // console.log(rects)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // ctx.setTransform(this.editor.scale, 0, 0, this.editor.scale, 0, 0);
    rectRender(ctx, rects)
    circleRender(ctx, dots)
  }

  if (this.isSelectAll) {
    BatchDrawer(this.editor.moduleMap)
  } else {
    const selectedModulesMap: ModuleMap = new Map()

    this.selectedModules.forEach(id => {
      this.editor.moduleMap.forEach((module) => {
        if (module.id === id) {
          selectedModulesMap.set(module.id, module)
        }
      })
    })

    BatchDrawer(selectedModulesMap)
  }
}

export default selectionRender