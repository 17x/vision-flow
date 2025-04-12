export interface InitViewportDomReturn {
  wrapper: HTMLDivElement
  selectionBox: HTMLDivElement
  mainCanvas: HTMLCanvasElement
  selectionCanvas: HTMLCanvasElement
  scrollBarX: HTMLDivElement
  scrollBarY: HTMLDivElement
}

export function initViewportDom(id: UID): InitViewportDomReturn {
  const boxColor = '#1FB3FF'
  const boxBgColor = 'rgba(31,180,255,0.1)'
  const wrapper = document.createElement('div')
  const selectionBox = document.createElement('div')
  const selectionCanvas: HTMLCanvasElement = document.createElement('canvas')

  const mainCanvas: HTMLCanvasElement = document.createElement('canvas')
  const {scrollBarX, scrollBarY} = generateScrollBars()
  const cssText = document.createElement('style')
  const wrapperId = 'editor-wrapper-' + id
  const mainCanvasId = 'editor-main-canvas-' + id
  const selectionCanvasId = 'editor-selection-canvas-' + id
  const selectionBoxId = 'editor-selection-box-' + id

  cssText.textContent = `
    #${mainCanvasId} {
      background-color: #f0f0f0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    #${selectionCanvasId} {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    #${wrapperId} {
      user-select: none;
      position: relative;
      scrollbar-width: thin;
      scrollbar-color: #787878 transparent;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    #${selectionBoxId} {
      pointer-events: none;
      position: absolute;
      border: 1px solid ${boxColor};
      background-color: ${boxBgColor};
    }
  `

  mainCanvas.id = mainCanvasId
  mainCanvas.setAttribute('editor-main-canvas', '')

  selectionCanvas.id = selectionCanvasId
  selectionCanvas.setAttribute('editor-selection-canvas', '')

  wrapper.id = wrapperId
  wrapper.setAttribute('editor-wrapper', '')

  selectionBox.id = selectionBoxId
  selectionBox.setAttribute('editor-selection-box', '')
  wrapper.append(mainCanvas, selectionCanvas, scrollBarX, scrollBarY, selectionBox, cssText)

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