import Editor from "./index.ts";
import coordinator from "./coordinator.ts";
import {Line} from "./editor";

class CrossLine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private editor: Editor;
  private xAxis: Line = {start: {x: 0, y: 0}, end: {x: 0, y: 0}};
  private yAxis: Line = {start: {x: 0, y: 0}, end: {x: 0, y: 0}};

  constructor(editor: Editor) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    this.editor = editor;
    this.canvas = canvas
    this.ctx = ctx

    canvas.style.position = 'absolute'
    canvas.style.zIndex = '10'
    canvas.style.pointerEvents = 'none';
    canvas.setAttribute('cross-line', '')
    editor.canvas.parentNode!.append(this.canvas)

    this.update()
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.editor.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  private removeEventListeners(): void {
    this.editor.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  private handleMouseMove(e: MouseEvent) {
    const x = e.clientX - this.canvas.offsetLeft;
    const y = e.clientY - this.canvas.offsetTop;
    // console.log(x, y)
    // this.render({x, y});
  }

  private update() {
    coordinator(this.editor.canvas, this.canvas)
    this.render({x: 0, y: 0})
  }

  private destroy() {
    this.removeEventListeners()
  }

  private render(p: Position): void {
    const {dpr, size} = this.editor
    const w = size.width;
    const h = size.height;

    const {x, y} = {x: p.x * dpr, y: p.y * dpr};
    const {ctx} = this;

    this.xAxis = {start: {x: 0, y}, end: {x: w, y}};
    this.yAxis = {start: {x, y: 0}, end: {x, y: h}};
    this.ctx.clearRect(0, 0, size.width, size.height);

    ctx.beginPath();
    ctx.setLineDash([5, 3]);
    ctx.lineWidth = 1
    ctx.moveTo(this.xAxis.start.x, this.xAxis.start.y);
    ctx.lineTo(this.xAxis.end.x, this.xAxis.end.y);
    ctx.stroke()
    ctx.moveTo(this.yAxis.start.x, this.yAxis.start.y);
    ctx.lineTo(this.yAxis.end.x, this.yAxis.end.y);
    ctx.stroke()
  }
}

export default CrossLine;