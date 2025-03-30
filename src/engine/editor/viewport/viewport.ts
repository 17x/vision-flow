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
    this.wrapper = document.createElement("div")
    this.editor = editor
    this.resizeThrottle = this.resizeThrottle.bind(this)
    this.resizeObserver = new ResizeObserver(this.resizeThrottle)
    this.doResize = this.doResize.bind(this)
    this.init()
  }

  init() {
    this.editor.container.innerHTML = ''
    this.wrapper.setAttribute('editor-wrapper', 'true')
    this.wrapper.style.overflow = 'hidden'
    this.wrapper.style.width = '100%'
    this.wrapper.style.height = '100%'
    this.editor.container.appendChild(this.wrapper)
    this.resizeObserver.observe(this.editor.container)
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