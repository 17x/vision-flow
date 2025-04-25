import {ResizeHandler, SelectionActionMode} from './type'
import typeCheck from '../../../utilities/typeCheck.ts'
import Editor from '../editor.ts'

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

  return
  if (moduleProps) {
    const module = this.moduleMap.get(moduleProps.id)
    const {scale, dpr} = this.viewport
    const lineWidth = 1 / scale * dpr
    const resizeSize = 2 / scale * dpr
    const lineColor = '#5491f8'

    const o = module!.getOperators({
      size: resizeSize,
      lineColor,
      lineWidth,
    }, {
      size: 1,
      lineColor: '',
      lineWidth: 0,
    })

    o.forEach(
      (p) => {
        this.operationHandlers.add(p)
      },
    )
  }
}
