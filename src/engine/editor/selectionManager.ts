import Editor from "./index.ts";
import coordinator from "./coordinator.ts";

class SelectionManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private selectedItems: Set<UID> = new Set();
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private dragStart: { x: number; y: number } = {x: 0, y: 0};
  private resizeHandleSize: number = 10;
  private activeResizeHandle: Item | null = null;
  private isDestroyed: boolean = false;
  private editor: Editor;
  private copiedItems: Modules = new Set();

  constructor(editor: Editor) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d")!;
    this.editor = editor;
    this.canvas = canvas;

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.bottom = "0";
    canvas.style.pointerEvents = "none";
    canvas.setAttribute("selection-manager", "");
    editor.canvas.parentNode!.append(this.canvas);

    this.bindShortcuts()
    this.update();
    this.setupEventListeners();
  }

  private bindShortcuts() {
    this.editor.shortcut.subscribe('select-all', this.selectAll.bind(this));
    this.editor.shortcut.subscribe('copy', this.selectAll.bind(this));
  }

  private unBindShortcuts() {
    this.editor.shortcut.unsubscribe('select-all', this.selectAll.bind(this));
    this.editor.shortcut.subscribe('copy', this.selectAll.bind(this));
  }

  private selectAll(): void {
    this.selectedItems.clear()
    this.editor.modules.forEach((module) => {
      this.selectedItems.add(module.id);
    })
    this.update();
  }

  private copy(): void {
    // this.copiedItems = {}
  }

  private setupEventListeners(): void {
    this.editor.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.editor.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.editor.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private removeEventListeners(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private handleMouseDown(e: MouseEvent): void {
    if (this.editor.panableContainer.isSpaceKeyPressed) return

    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const mousePointX = mouseX
    const mousePointY = mouseY
    this.isDragging = true;
    this.dragStart = {x: mouseX, y: mouseY};

    const possibleModules = this.editor.modules.filter((item) => {
      const {top, right, bottom, left} = item.getBoundingRect()

      return mouseX > left && mouseY > top && mousePointX < right && mousePointY < bottom
    })

    if (!possibleModules.length) {
      this.selectedItems.clear();
      return
    }

    const lastOne = possibleModules[possibleModules.length - 1];
    const id = lastOne.id

    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id)
    } else {
      this.selectedItems.add(id)
    }

    // console.log(this.selectedItems)

    this.render();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.isResizing && this.activeResizeHandle) {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      // Calculate the new size based on the mouse position
      const newSize = Math.max(20, Math.min(this.canvas.width, this.canvas.height, mouseX - this.activeResizeHandle.x, mouseY - this.activeResizeHandle.y));

      // Apply the resize effect
      this.activeResizeHandle.size = newSize;
      this.render();
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    this.isResizing = false;
    this.activeResizeHandle = null; // Reset active resize handle
    this.render();
  }

  private render(): void {
    const enableRotationHandle = this.selectedItems.size === 1
    const {ctx} = this

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // console.log(this.selectedItems);


    this.editor.modules.forEach((item) => {
      // Drawing selected items
      ctx.save();
      if (enableRotationHandle) {
        // this.ctx.translate(item.x + item.size / 2, item.y + item.size / 2); // Move origin to center of item
        // this.ctx.rotate(item.rotation); // Apply rotation
      }

      // this.ctx.fillStyle = this.selectedItems.has(item.id) ? "green" : "blue";
      // this.ctx.fillRect(-item.size / 2, -item.size / 2, item.size, item.size);

      // Draw resize handle at the center
      if (this.selectedItems.has(item.id)) {
        // console.log(item.type)
        const {x, y, width, height} = item.getBoundingRect()
        const handleSize = this.resizeHandleSize / 2
        const handlePoints: Position[] = [{x, y}, {x: x + width / 2, y}, {x: x + width, y}, {
          x: x + width, y: y + height / 2
        }, {x: x + width, y: y + height}, {x: x + width / 2, y: y + height}, {x: x + width / 2, y: y + height}, {
          x: x, y: y + height
        }, {x: x, y: y + height / 2},]

        ctx.strokeStyle = "#ff0000";
        ctx.strokeRect(x, y, width, height,);

        handlePoints.forEach(({x, y}) => {
          ctx.beginPath();
          ctx.ellipse(x, y, handleSize, handleSize, 0, 0, 360);
          ctx.fill();
        })
      }
      this.ctx.restore();
    });
  }

  private update() {
    coordinator(this.editor.canvas, this.canvas);
    this.render();
  }

  private destroy(): void {
    if (this.isDestroyed) return;

    this.unBindShortcuts()

    this.removeEventListeners();
    this.selectedItems.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.isDestroyed = true;
    console.log("SelectionModule destroyed.");
  }
}

export default SelectionManager;
