import Editor from '../../editor.ts'

function handleContextMenu(this: Editor, e: MouseEvent) {
  // const dataName = 'editor-contextmenu-dom'
  // const contextMenuDom = document.createElement('div')

  e.preventDefault()
  e.stopPropagation()

  if (e.ctrlKey) {
    return false
  }

  const lastId = this.hoveredModule
  const selectedIdSet = this.getSelected
  const position = {...this.viewport.mouseMovePoint}
  let idSet = new Set<UID>()

  if (lastId) {
    if (selectedIdSet.has(lastId)) {
      idSet = selectedIdSet
    } else {
      idSet.add(lastId)
    }
  }

  // console.log(this.copiedItems)
  this.action.dispatch('context-menu', {
    idSet,
    position,
    copiedItems: this.copiedItems.length > 0,
  })
}

export default handleContextMenu
