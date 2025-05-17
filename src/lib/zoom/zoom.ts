class Zoom {
  dom: HTMLElement
  mouse: boolean
  touchpad: boolean

  constructor({
                dom,
                mouse = true,
                touchpad = true,
              }) {

    this.dom = dom
    this.mouse = mouse
    this.touchpad = touchpad
  }

  destroy() {

  }
}

export default Zoom