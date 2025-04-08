import Viewport from '../viewport.ts'

// import {updateSelectionBox} from "../domManipulations.ts"

function handleContextMenu(this: Viewport, e: MouseEvent) {
  const dataName = 'editor-contextmenu-dom'
  const contextMenuDom = document.createElement('div')
  const remove = (event: MouseEvent) => {
    // console.log(event.target, (contextMenuDom))
    if (!event.target!.contains(contextMenuDom)) {
      // console.log(event.target!.dataset.action)
      const code = event.target!.dataset.action

      console.log(code)
      if (code === 'select-all') {
        this.editor.action.dispatch({
          type: 'module-select-all',
          data: null,
        })
      }

      e.preventDefault()
      e.stopPropagation()
    }

    window.removeEventListener('mousedown', remove)
    contextMenuDom.remove()
  }

  contextMenuDom.dataset.name = dataName
  contextMenuDom.style.position = 'fixed'
  contextMenuDom.style.top = e.clientY + 'px'
  contextMenuDom.style.left = e.clientX + 'px'
  contextMenuDom.style.backgroundColor = '#dfdfdf'
  contextMenuDom.style.padding = '10px 10px'
  contextMenuDom.style.width = '200px'
  contextMenuDom.style.height = 'auto'
  contextMenuDom.style.boxShadow = 'rgb(194 194 194) 0px 0px 1px 1px'

  contextMenuDom.innerHTML = `
    <div>
      <div data-action="undo">Undo</div>
      <div data-action="redo">Redo</div>
      <div data-action="paste">Paste</div>
      <div data-action="select-all">Select All</div>
    </div>
  `
  contextMenuDom.onclick = (event) => {
    console.log(event.target)
    // event.preventDefault()
    // event.stopPropagation()
  }
  this.wrapper.append(contextMenuDom)
  window.addEventListener('mousedown', remove)

  e.preventDefault()
  e.stopPropagation()
}

export default handleContextMenu

