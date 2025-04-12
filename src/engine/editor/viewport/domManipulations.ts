export interface InitViewportDomReturn {
  wrapper: HTMLDivElement
  selectionBox: HTMLDivElement
  mainCanvas: HTMLCanvasElement
  selectionCanvas: HTMLCanvasElement
  scrollBarX: HTMLDivElement
  scrollBarY: HTMLDivElement
  cursor: HTMLDivElement
}

const createWith = <T extends keyof HTMLElementTagNameMap>(tagName: T, role: string, id: string): HTMLElementTagNameMap[T] => {
  const dom = document.createElement(tagName)
  dom.setAttribute(role, '')
  dom.id = role + '-' + id

  return dom
}

export function initViewportDom(id: UID): InitViewportDomReturn {
  const boxColor = '#1FB3FF'
  const boxBgColor = 'rgba(31,180,255,0.1)'
  const wrapper = createWith('div', 'editor-wrapper', id)
  const mainCanvas = createWith('canvas', 'editor-main-canvas', id)
  const selectionCanvas = createWith('canvas', 'editor-selection-canvas', id)
  const scrollBarX = createWith('div', 'scroll-bar-x', id)
  const scrollBarY = createWith('div', 'scroll-bar-x', id)
  const selectionBox = createWith('div', 'editor-selection-box', id)
  const cursor = createWith('div', 'editor-cursor', id)
  const cssText = createWith('style', 'editor-style', id)

  cssText.textContent = `
    #${mainCanvas.id} {
      background-color: #f0f0f0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    #${selectionCanvas.id} {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    #${wrapper.id} {
      user-select: none;
      position: relative;
      scrollbar-width: thin;
      scrollbar-color: #787878 transparent;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    #${selectionBox.id} {
      display: none;
      pointer-events: none;
      position: absolute;
      border: 1px solid ${boxColor};
      background-color: ${boxBgColor};
    }
    
    #${scrollBarX.id},
    #${scrollBarY.id}{
      background-color: #787878;
      user-select:none;
      translate:none;
    }
    
    #${cursor.id}{
      display: none;
      pointer-events: none;
      width:2rem;
      height:2rem;
    }
  `

  wrapper.append(mainCanvas, selectionCanvas, scrollBarX, scrollBarY, selectionBox, cursor, cssText)

  return {
    wrapper,
    selectionBox,
    selectionCanvas,
    mainCanvas,
    scrollBarX,
    scrollBarY,
    cursor,
  }
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

export const updateCursor = (wrapper: HTMLDivElement, cursor: HTMLDivElement, centerPoint: Point | 'hide', mousePoint?: Point) => {
  if (centerPoint === 'hide') {
    cursor.style.display = 'none'
    wrapper.style.cursor = 'default'
    return
  }

  wrapper.style.cursor = 'none'
  cursor.style.display = 'block'
  cursor.style.transform = `translate(${mousePoint!.x}px, ${mousePoint!.y}px)`
  cursor.style.backgroundColor = 'blue'
}