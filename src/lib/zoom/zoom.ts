export interface ZoomOptions {
  dom: HTMLElement
  mouse: true,
  touchpad: true,
}

class Zoom {
  dom: HTMLElement
  mouse: boolean
  touchpad: boolean

  constructor({
                dom,
                mouse = true,
                touchpad = true,
              }: ZoomOptions) {
    this.dom = dom
    this.mouse = mouse
    this.touchpad = touchpad
  }

  destroy() {

  }
}

export default Zoom