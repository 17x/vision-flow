import {use, useMemo, useRef} from "react";

const MAIN_CANVAS = document.createElement('canvas');
const MAIN_CONTEXT = MAIN_CANVAS.getContext('2d');


type RendererProps = {
  canvas: HTMLCanvasElement;
}

class Renderer {
  private canvas_ctx: CanvasRenderingContext2D | null;

  constructor({canvas}: RendererProps) {
    console.log(canvas)
    this.canvas_ctx = canvas.getContext('2d');

    console.log(this.canvas_ctx)
  }


}

export default Renderer


