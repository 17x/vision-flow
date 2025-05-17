export interface ZoomOptions {
  dom: HTMLElement
  mouse?: true,
  touchpad?: true,
  mouseScrollModifier?: 'alt' | 'ctrl'
}

class Zoom {
  protected dom: HTMLElement
  protected mouse: boolean
  protected touchpad: boolean
  protected eventsController: AbortController
  protected mouseScrollModifier: 'alt' | 'ctrl' | 'shift' | 'meta'

  constructor({
                dom,
                mouse = true,
                touchpad = true,
                mouseScrollModifier = 'alt',
              }: ZoomOptions) {
    this.dom = dom
    this.mouse = mouse
    this.touchpad = touchpad
    this.eventsController = new AbortController()
    this.mouseScrollModifier = mouseScrollModifier

    this.dom.addEventListener('wheel', this.handleWheel.bind(this), {
      signal: this.eventsController.signal,
      passive: false,
    })
  }

  handleWheel(event: WheelEvent) {
    console.log('handleWheel', event)
  }

  destroy() {
    this.dom = null!
    this.mouse = null!
    this.touchpad = null!
    this.eventsController.abort()
    this.eventsController = null!
  }
}

export default Zoom