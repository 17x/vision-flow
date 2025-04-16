import Rectangle from '../../core/modules/shapes/rectangle.ts'
// import {drawCrossLine} from '../../lib/lib.ts'
import Editor from '../editor.ts'

function selectionRender(this: Editor) {
  if (this.moduleMap.size === 0) return

  const {selectionCTX: ctx} = this.viewport
  const fillColor = '#5491f8'
  const lineColor = '#5491f8'
  const selected = this.getVisibleSelected
  const centerPointWidth = 2 / this.viewport.scale * this.viewport.dpr
  const lineWidth = 1 / this.viewport.scale * this.viewport.dpr
  const centerPoints = new Set<UID>(selected)

  if (this.hoveredModule) {
    centerPoints.add(this.hoveredModule)
  }

  // render selection box for modules
  selected.forEach((id) => {
    const module = this.moduleMap.get(id)

    if (module) {
      const moduleSelectionBoundary = module.getSelectedBoxModule(lineWidth, lineColor)
      moduleSelectionBoundary.render(ctx)
    }
  })

  // render center points
  centerPoints.forEach((id) => {
    const module = this.moduleMap.get(id)
    const {x, y, rotation, layer} = (module as Rectangle).getDetails()
    const lineWidth = 1 / this.viewport.scale * this.viewport.dpr
    const highlightModule = module!.getHighlightModule(lineWidth, fillColor) as ModuleInstance

    highlightModule!.render(ctx)
    const centerDotRect = new Rectangle({
      x,
      y,
      layer,
      id: id + 'hover-center',
      width: centerPointWidth * 2,
      height: centerPointWidth * 2,
      fillColor: fillColor,
      lineColor: 'transparent',
      lineWidth,
      rotation,
      opacity: 100,
      radius: id === this.hoveredModule ? 0 : centerPointWidth,
    })

    centerDotRect.render(ctx)
    // selected
    if (id !== this.hoveredModule) {

    }
  })

  this.operationHandlers.forEach(operation => {
    operation.module.render(ctx)
  })

  /*  if (this.hoveredModule) {
      const module = this.getVisibleModuleMap.get(this.hoveredModule)

      if (module) {
        const moduleProps = module.getDetails() as EllipseProps
        const dot = new Ellipse({
          x: module.x,
          y: module.y,
          layer: module.layer,
          r1: centerPointWidth,
          r2: centerPointWidth,
          fillColor,
          lineWidth: 0,
          lineColor: 'transparent',
          id: moduleProps.id + 'hover-center',
          opacity: 100,
        })

        dot.render(ctx)
      }
    }*/

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