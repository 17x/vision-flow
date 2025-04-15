import {ResizeHandler, SelectionActionMode} from './type'
import typeCheck from '../../../utilities/typeCheck.ts'
import Editor from '../editor.ts'
import {RectangleProps} from '../../core/modules/shapes/rectangle.ts'
import {createHandlersForRect} from '../../lib/lib.ts'

export function modifySelected(
  this: Editor,
  idSet: Set<UID>,
  action: SelectionActionMode,
) {
  if (typeCheck(idSet) !== 'set') return

  let eventCallBackData = null

  if (idSet.size === 1) {
    const first = [...idSet.values()][0]

    if (this.moduleMap.has(first)) {
      eventCallBackData = this.moduleMap.get(first).getDetails()
      // console.log(eventCallBackData)
    }
  }
  const realSelectedModules = this.getSelected

  this.selectedModules.clear()

  if (action === 'replace') {
    realSelectedModules.clear()
  }

  idSet.forEach((id) => {
    switch (action) {
      case 'add':
        realSelectedModules.add(id)
        break
      case 'delete':
        realSelectedModules.delete(id)
        break
      case 'toggle':
        if (realSelectedModules.has(id)) {
          realSelectedModules.delete(id)
        } else {
          realSelectedModules.add(id)
        }
        break
      case 'replace':
        realSelectedModules.add(id)
        break
    }
  })

  realSelectedModules.forEach((id) => this.selectedModules.add(id))
  // this.events.onSelectionUpdated?.(idSet, eventCallBackData)
}

export function updateSelectionCanvasRenderData(this: Editor) {
  const moduleProps = this.getSelectedPropsIfUnique
  console.log(moduleProps)
  if (moduleProps) {
    const {scale, dpr} = this.viewport
    const module = this.moduleMap.get(moduleProps.id)
    const o = module!.getOperators(scale, dpr)

    o.forEach(
      (p) => {

        this.operationHandlers.add(p)
      },
    )
  }
}
