import Editor from "../editor.ts"

class Viewport {
  editor: Editor
  wrapper: HTMLDivElement
  width: number = 0
  height: number = 0
  resizeTimeout: number | undefined
  private resizeObserver: ResizeObserver
  private readonly resizeInterval: number = 100

  constructor(editor: Editor) {
    this.editor = editor
    this.wrapper = document.createElement("div")
    this.resizeThrottle = this.resizeThrottle.bind(this)
    this.resizeObserver = new ResizeObserver(this.resizeThrottle)
    this.doResize = this.doResize.bind(this)
    this.init()
  }

  init() {
    this.editor.container.innerHTML = ''
    this.wrapper.setAttribute('editor-wrapper', 'true')
    this.wrapper.style.scrollbarWidth = 'thin'
    this.wrapper.style.scrollbarColor = '#787878 transparent'
    this.wrapper.style.overflow = 'auto'
    this.wrapper.style.width = '100%'
    this.wrapper.style.height = '100%'
    this.editor.container.appendChild(this.wrapper)
    this.resizeObserver.observe(this.editor.container)

    //test
    const placeholder = document.createElement('div')
    placeholder.style.width = window.innerWidth + 'px'
    placeholder.style.height = window.innerHeight + 'px'
    this.wrapper.appendChild(placeholder)
  }

  resizeThrottle() {
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(this.doResize, this.resizeInterval)
  }

  doResize() {
    const rect = this.editor.container.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height
  }

  destroy() {
    clearTimeout(this.resizeTimeout)
    this.resizeObserver.disconnect()

    this.wrapper.style.width = '100%'
    this.wrapper.style.height = '100%'
    this.wrapper.remove()
    this.editor.container.innerHTML = ''
  }
}

export default Viewport