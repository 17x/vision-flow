export interface ZoomOptions {
  dom: HTMLElement
  mouse: true,
  touchpad: true,
}

class Zoom {
  dom: HTMLElement
  mouse: boolean
  touchpad: boolean
  eventsController: AbortController

  constructor({
                dom,
                mouse = true,
                touchpad = true,
              }: ZoomOptions) {
    this.dom = dom
    this.mouse = mouse
    this.touchpad = touchpad
    this.eventsController = new AbortController()
  }

  static(this: Zoom) {

  }

  destroy() {

  }
}

export default Zoom