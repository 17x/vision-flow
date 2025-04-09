import Editor from '../../editor.ts'

function handleContextMenu(this: Editor, e: MouseEvent) {
  // const dataName = 'editor-contextmenu-dom'
  // const contextMenuDom = document.createElement('div')

  e.preventDefault()
  e.stopPropagation()
  console.log('mem')
  if (e.ctrlKey) {
    return false
  }

  const lastId = [...this.hoveredModules][this.hoveredModules.size - 1]
  const selectedIdSet = this.getSelectedIdSet()
  const position = {...this.viewport.mouseMovePoint}
  let idSet = new Set()

  if (lastId) {
    if (selectedIdSet.has(lastId)) {
      idSet = selectedIdSet
    } else {
      idSet.add(lastId)
    }
  }

  this.action.dispatch({
    type: 'context-menu',
    data: {
      idSet,
      position,
    },
  })
}

export default handleContextMenu

