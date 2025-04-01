import Viewport from "../viewport.ts"

// import {updateSelectionBox} from "../domManipulations.ts"

function handleContextMenu(this: Viewport, e: MouseEvent) {
  const dataName = 'editor-contextmenu-dom'
  const contextMenuDom = document.createElement('div')
  const remove = () => {
    window.removeEventListener('mousedown', remove)
    contextMenuDom.remove()
  }

  window.addEventListener('mousedown', remove)

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
      <div>Undo</div>
      <div>Redo</div>
      <div>Paste</div>
      <div>Select All</div>
    </div>
  `

  this.wrapper.append(contextMenuDom)

  e.preventDefault()
  e.stopPropagation()
}

export default handleContextMenu

