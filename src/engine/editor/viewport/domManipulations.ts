export interface InitViewportDomReturn {
  wrapper: HTMLDivElement
  selectionBox: HTMLDivElement
  mainCanvas: HTMLCanvasElement
  selectionCanvas: HTMLCanvasElement
  scrollBarX: HTMLDivElement
  scrollBarY: HTMLDivElement
}
export function initViewportDom(): InitViewportDomReturn {
  const boxColor = '#1FB3FF'
  const boxBgColor = 'rgba(31,180,255,0.1)'
  const wrapper = document.createElement('div')
  const selectionBox = document.createElement('div')
  const selectionCanvas: HTMLCanvasElement = document.createElement('canvas')
  const mainCanvas: HTMLCanvasElement = document.createElement('canvas')
  const {scrollBarX, scrollBarY} = generateScrollBars()

  mainCanvas.setAttribute('editor-main-canvas', '')
  mainCanvas.style.backgroundColor = '#f0f0f0'
  mainCanvas.style.position = 'absolute'
  mainCanvas.style.left = '0'
  mainCanvas.style.top = '0'
  mainCanvas.style.width = '100%'
  mainCanvas.style.height = '100%'
  mainCanvas.style.pointerEvents = 'none'

  selectionCanvas.setAttribute('editor-selection-canvas', '')
  selectionCanvas.style.position = 'absolute'
  selectionCanvas.style.left = '0'
  selectionCanvas.style.top = '0'
  selectionCanvas.style.width = '100%'
  selectionCanvas.style.height = '100%'
  selectionCanvas.style.pointerEvents = 'none'

  wrapper.setAttribute('editor-wrapper', '')
  wrapper.style.userSelect = 'none'
  wrapper.style.position = 'relative'
  wrapper.style.scrollbarWidth = 'thin'
  wrapper.style.scrollbarColor = '#787878 transparent'
  wrapper.style.overflow = 'hidden'
  wrapper.style.width = '100%'
  wrapper.style.height = '100%'

  selectionBox.setAttribute('editor-selection-box', '')
  selectionBox.style.pointerEvents = 'none'
  selectionBox.style.position = 'absolute'
  selectionBox.style.border = '1px solid ' + boxColor
  selectionBox.style.backgroundColor = boxBgColor

  wrapper.append(mainCanvas, selectionCanvas, scrollBarX, scrollBarY, selectionBox)

  return {
    wrapper,
    selectionBox,
    selectionCanvas,
    mainCanvas,
    scrollBarX,
    scrollBarY,
  }
}

export const generateScrollBars = (): { scrollBarX: HTMLDivElement, scrollBarY: HTMLDivElement } => {
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

export const updateScrollBars = (scrollBarX: HTMLDivElement, scrollBarY: HTMLDivElement) => {
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

export const updateSelectionBox = (selectionBox: HTMLDivElement, {x, y, height, width}: Rect, show = true) => {
  selectionBox.style.transform = `translate(${x}px, ${y}px)`
  selectionBox.style.width = width + 'px'
  selectionBox.style.height = height + 'px'
  selectionBox.style.display = show ? 'block' : 'none'
}