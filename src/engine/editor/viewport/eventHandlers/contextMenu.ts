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
      this.action.dispatch({
        type: 'selection-modify',
        data: {
          mode: 'replace',
          lastId: new Set(idSet),
        },
      })
    }
  }

  this.action.dispatch({
    type: 'context-menu',
    data: {
      idSet,
      position,
    },
  })
  return
  // console.log(this.hoveredModules)
  const remove = (event: MouseEvent) => {
    const dom = event.target as HTMLElement
    // console.log(dom)
    // console.log(event)
    if (contextMenuDom.contains(dom)) {
      const {action, disabled} = dom.dataset

      if (disabled === 'true') {
        return false
      }

      if (action) {
        this.action.dispatch({
          type: action,
          data: null,
        })
      }

      e.preventDefault()
      e.stopPropagation()
    }

    window.removeEventListener('mousedown', remove)
    contextMenuDom.remove()
  }

  const disableCopy = lastId ? 'false' : 'true'
  const disableDelete = lastId ? 'false' : 'true'
  const id = 'editor-context-menu-' + this.id

  contextMenuDom.id = id
  contextMenuDom.dataset.name = dataName
  contextMenuDom.innerHTML = `
    <style>
        #${id}{
            position: fixed;
            background-color:#dfdfdf;
            padding : 10px 10px;
            width : 200px;
            height : auto;
            box-shadow : rgb(194 194 194) 0 0 1px 1px;
            top:${e.clientY}px;
            left:${e.clientX}px;
        }
        
        #${id} div{
            color:black ;
        }
        
        #${id}>div>div:hover{
            background-color:blue;
            color:white;
            cursor:pointer;
        }
        
        #${id}>div>div[data-disabled=true],
        #${id}>div>div[data-disabled=true]:hover{
            background-color:transparent;
            color:grey;
            cursor:not-allowed;
        }
        
        #${id} .divide{
            width: 100%;
            height: 1px;
            border-top:1px solid #a2a2a2;
            margin:10px 0;
         }        
    </style>
    <div>
      <div data-action="module-copy" data-disabled="${disableCopy}" data-id="${lastId}">Copy</div>
      <div data-action="selection-paste" data-disabled="true">Paste</div>
      <div class="divide"></div>
      <div data-action="module-delete" data-disabled="${disableDelete}">Delete</div>
      <div class="divide"></div>
      <div data-action="history-undo">Undo</div>
      <div data-action="history-redo">Redo</div>
      <div class="divide"></div>
      <div data-action="select-all">Select All</div>
    </div>
  `

  this.viewport.wrapper.append(contextMenuDom)
  window.addEventListener('mousedown', remove)
}

export default handleContextMenu

