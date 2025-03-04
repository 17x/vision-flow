import Editor from "./index.ts";
import coordinator from "./coordinator.ts";

class SelectionManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private selectedItems: Set<number> = new Set();
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private dragStart: { x: number, y: number } = {x: 0, y: 0};
  private resizeHandleSize: number = 10;
  private activeResizeHandle: Item | null = null;
  private isDestroyed: boolean = false;
  private editor: Editor;

  constructor(editor: Editor) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d")!;
    this.editor = editor;
    this.canvas = canvas

    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.bottom = '0'
    canvas.style.pointerEvents = 'none';
    canvas.dataset['name'] = 'SelectionManager-' + this.editor.id;
    console.log(this)
    editor.canvas.parentNode!.append(this.canvas)

    // Create sample items
    /* for (let i = 0; i < 10; i++) {
       this.items.push({
         id: i,
         x: Math.random() * this.canvas.width,
         y: Math.random() * this.canvas.height,
         size: 30,
         rotation: 0,
         originalSize: 30
       });
     }*/

    this.update()
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private removeEventListeners(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private handleMouseDown(e: MouseEvent): void {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    this.isDragging = true;
    this.dragStart = {x: mouseX, y: mouseY};

    // Detect if the mouse is on a resize handle
    this.editor.modules.forEach(item => {
      const resizeHandleX = item.x + item.size / 2 - this.resizeHandleSize / 2;
      const resizeHandleY = item.y + item.size / 2 - this.resizeHandleSize / 2;
      if (
        mouseX >= resizeHandleX && mouseX <= resizeHandleX + this.resizeHandleSize &&
        mouseY >= resizeHandleY && mouseY <= resizeHandleY + this.resizeHandleSize
      ) {
        this.isResizing = true;
        this.activeResizeHandle = item;
      } else if (mouseX >= item.x && mouseX <= item.x + item.size && mouseY >= item.y && mouseY <= item.y + item.size) {
        // Single item selection or multi-selection
        if (e.ctrlKey || e.metaKey) {
          if (this.selectedItems.has(item.id)) {
            this.selectedItems.delete(item.id);
          } else {
            this.selectedItems.add(item.id);
          }
        } else {
          this.selectedItems.clear();
          this.selectedItems.add(item.id);
        }
      }
    });

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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    console.log(this.editor.modules)
    this.editor.modules.forEach(item => {
      // Drawing selected items
      this.ctx.save();
      this.ctx.translate(item.x + item.size / 2, item.y + item.size / 2); // Move origin to center of item
      this.ctx.rotate(item.rotation); // Apply rotation

      // Draw the item (centered rectangle)
      this.ctx.fillStyle = this.selectedItems.has(item.id) ? "green" : "blue";
      this.ctx.fillRect(-item.size / 2, -item.size / 2, item.size, item.size);

      // Draw resize handle at the center
      if (this.selectedItems.has(item.id)) {
        const handleX = item.x + item.size / 2 - this.resizeHandleSize / 2;
        const handleY = item.y + item.size / 2 - this.resizeHandleSize / 2;
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(handleX, handleY, this.resizeHandleSize, this.resizeHandleSize);
      }

      this.ctx.restore();
    });
  }

  private update() {
    coordinator(this.editor.canvas, this.canvas)
    this.render({x: 0, y: 0})
  }

  private destroy(): void {
    if (this.isDestroyed) return;

    this.removeEventListeners();
    this.selectedItems.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.isDestroyed = true;
    console.log("SelectionModule destroyed.");
  }
}

export default SelectionManager;