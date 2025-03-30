import Viewport from "./viewport.ts"

function initViewportDom(this: Viewport) {
  const boxColor = '#1FB3FF'
  const boxBgColor = 'rgba(31,180,255,0.5)'
  this.editor.container.innerHTML = ''

  this.mainCanvas.setAttribute('editor-main-canvas', '')
  this.mainCanvas.style.position = 'absolute'
  this.mainCanvas.style.left = '0'
  this.mainCanvas.style.top = '0'
  this.mainCanvas.style.width = '100%'
  this.mainCanvas.style.height = '100%'
  this.mainCanvas.style.pointerEvents = 'none'

  this.selectionCanvas.setAttribute('editor-selection-canvas', '')
  this.selectionCanvas.style.position = 'absolute'
  this.selectionCanvas.style.left = '0'
  this.selectionCanvas.style.top = '0'
  this.selectionCanvas.style.width = '100%'
  this.selectionCanvas.style.height = '100%'
  this.selectionCanvas.style.pointerEvents = 'none'

  this.wrapper.setAttribute('editor-wrapper', '')
  // this.wrapper.classList.add('scroll-custom-2')
  this.wrapper.style.userSelect = 'none'
  this.wrapper.style.position = 'relative'
  this.wrapper.style.scrollbarWidth = 'thin'
  this.wrapper.style.scrollbarColor = '#787878 transparent'
  this.wrapper.style.overflow = 'hidden'
  this.wrapper.style.width = '100%'
  this.wrapper.style.height = '100%'

  this.selectionBox.setAttribute('editor-selection-box', '')
  this.selectionBox.style.pointerEvents = 'none'
  this.selectionBox.style.position = 'absolute'
  this.selectionBox.style.border = '1px solid ' + boxColor
  this.selectionBox.style.backgroundColor = boxBgColor

  updateScrollBars(this.scrollBarX, this.scrollBarY)
  updateSelectionBox(this.selectionBox, {x: 0, y: 0, width: 0, height: 0}, false)
  this.wrapper.append(this.mainCanvas, this.selectionCanvas, this.scrollBarX, this.scrollBarY, this.selectionBox)
  this.editor.container.appendChild(this.wrapper)
}

const generateScrollBars = (): { scrollBarX: HTMLDivElement, scrollBarY: HTMLDivElement } => {
  const scrollBarX = document.createElement('div')
  const scrollBarY = document.createElement('div')

  scrollBarX.setAttribute('scroll-bar-x', '')
  scrollBarY.setAttribute('scroll-bar-y', '')
  scrollBarX.style.backgroundColor = '#787878'
  scrollBarY.style.backgroundColor = '#787878'
  scrollBarX.style.userSelect = 'none'
  scrollBarY.style.userSelect = 'none'
  scrollBarY.style.translate = 'none'
  scrollBarY.style.translate = 'none'

  return {scrollBarX, scrollBarY}
}

const updateScrollBars = (scrollBarX: HTMLDivElement, scrollBarY: HTMLDivElement) => {
  scrollBarX.style.width = '50px'
  scrollBarX.style.height = '6px'
  scrollBarX.style.position = 'absolute'
  scrollBarX.style.bottom = '0'
  scrollBarX.style.left = '0'

  scrollBarY.style.width = '6px'
  scrollBarY.style.height = '50px'
  scrollBarY.style.position = 'absolute'
  scrollBarY.style.right = '0'
  scrollBarY.style.top = '0'
}

const updateSelectionBox = (selectionBox: HTMLDivElement, {x, y, height, width}: Rect, show = true) => {
  selectionBox.style.transform = `translate(${x}px, ${y}px)`
  selectionBox.style.width = width + 'px'
  selectionBox.style.height = height + 'px'
  selectionBox.style.display = show ? 'block' : 'none'
}

export {initViewportDom, generateScrollBars, updateScrollBars, updateSelectionBox}