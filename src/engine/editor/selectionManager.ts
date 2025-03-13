import Editor from "./index.ts";
import coordinator from "./coordinator.ts";
import {ModifyModuleMap} from "./editor";
import {RectangleRenderProps, rectRender} from "../core/renderer.ts";

type CopiedModuleProps = Omit<ModuleProps, 'id'>
type KeyboardDirectionKeys = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'

class SelectionManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private selectedModules: Set<UID> = new Set();
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private dragStart: {
    x: number; y: number
  } = {
    x: 0, y: 0
  };
  private resizeHandleSize: number = 10;
  private activeResizeHandle: Item | null = null;
  private isDestroyed: boolean = false;
  private editor: Editor;
  private copiedItems: CopiedModuleProps[] = []
  private isSelectAll: boolean = false

  constructor(editor: Editor) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d")!;
    this.editor = editor;
    this.canvas = canvas;

    coordinator(this.editor.canvas, this.canvas);
    this.ctx.scale(this.editor.dpr, this.editor.dpr)

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.bottom = "0";
    canvas.style.pointerEvents = "none";
    canvas.setAttribute("selection-manager", "");
    editor.canvas.parentNode!.append(this.canvas);

    this.bindShortcuts()
    this.render();
    this.setupEventListeners();
  }

  private bindShortcuts() {
    this.editor.shortcut.subscribe('select-all', this.selectAll.bind(this));
    this.editor.shortcut.subscribe('copy', this.copy.bind(this));
    this.editor.shortcut.subscribe('paste', this.paste.bind(this));
    this.editor.shortcut.subscribe('duplicate', this.duplicate.bind(this));
    this.editor.shortcut.subscribe('delete', this.delete.bind(this));
    this.editor.shortcut.subscribe('escape', this.escape.bind(this));
    this.editor.shortcut.subscribe('modify-modules', this.modifyModules.bind(this));
  }

  private unBindShortcuts() {
    this.editor.shortcut.unsubscribe('select-all', this.isSelectAll.bind(this));
    this.editor.shortcut.unsubscribe('copy', this.copy.bind(this));
    this.editor.shortcut.unsubscribe('paste', this.paste.bind(this));
    this.editor.shortcut.unsubscribe('duplicate', this.duplicate.bind(this));
    this.editor.shortcut.unsubscribe('delete', this.delete.bind(this));
    this.editor.shortcut.unsubscribe('escape', this.escape.bind(this));
    this.editor.shortcut.unsubscribe('modify-modules', this.modifyModules.bind(this));
  }

  public replaceSelectModules(ids: UID[]) {
    this.selectedModules.clear()
    ids.forEach((id) => {
      this.selectedModules.add(id);
    })
    // console.log(this.selectedModules);
    this.render();
  }

  private selectAll(): void {
    this.selectedModules.clear()
    this.isSelectAll = true
    /*this.editor.modules.forEach((module) => {
      this.selectedModules.add(module.id);
    })*/
    this.render();
  }

  private copy(): void {
    this.copiedItems = []

    this.copiedItems = this.editor.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsPosition()
  }

  private paste(): void {
    const newModules = this.editor.addModules(this.copiedItems, 'paste-modules')
    this.replaceSelectModules(newModules.map(module => module.id))
    this.updateCopiedItemsPosition()
  }

  private duplicate(): void {
    let temp: Map<UID, Modules>
    const offsetX = 10
    const offsetY = 10

    if (this.isSelectAll) {
      temp = this.editor.batchCopy('all', true)
    } else {
      temp = this.editor.batchCopy(this.selectedModules, true)
    }

    temp.forEach((module: ModuleProps) => {
      module.x += offsetX
      module.y += offsetY
    })

    this.editor.batchAdd(temp, 'duplicate-modules')
    this.isSelectAll = false
    this.replaceSelectModules(Array.from(temp.keys()))
    this.updateCopiedItemsPosition()
  }

  private delete(): void {
    if (this.isSelectAll) {
      this.editor.batchDelete('all', 'delete-modules')
    } else {
      this.editor.batchDelete(this.selectedModules, 'delete-modules')
    }

    this.editor.selectionManager.clearSelectedItems()
  }

  private escape(): void {
    this.isSelectAll = false
    this.clearSelectedItems()
  }

  private modifyModules(e: KeyboardEvent, i?: KeyboardDirectionKeys): void {
    const offsetX = 10
    const offsetY = 10
    const modifyData: { x?: number, y?: number } = {}

    if (this.selectedModules.size > 0 || this.isSelectAll) {
      e.preventDefault()
    }

    if (i === 'ArrowUp') {
      modifyData.y = -offsetY
    }

    if (i === 'ArrowDown') {
      modifyData.y = offsetY
    }
    if (i === 'ArrowLeft') {
      modifyData.x = -offsetX
    }

    if (i === 'ArrowRight') {
      modifyData.x = offsetX
    }

    if (this.isSelectAll) {
      this.editor.batchModify('all', modifyData, 'modify-modules')
    } else {
      this.editor.batchModify(this.selectedModules, modifyData, 'modify-modules')
    }

    this.render()
  }

  private updateCopiedItemsPosition(): void {
    this.copiedItems.forEach(copiedItem => {
      copiedItem.x += Math.floor(Math.random() * 10)
      copiedItem.y += Math.floor(Math.random() * 20)
    })
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
    this.dragStart = {
      x: mouseX, y: mouseY
    };

    const possibleModules = Array.from(this.editor.modules.values()).filter((item) => {
      const {
        top, right, bottom, left
      } = item.getBoundingRect()

      return mouseX > left && mouseY > top && mousePointX < right && mousePointY < bottom
    })

    if (!possibleModules.length) {
      this.selectedModules.clear();
      return
    }

    const lastOne = possibleModules[possibleModules.length - 1];
    const id = lastOne.id

    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      if (this.selectedModules.has(id)) {
        this.selectedModules.delete(id)
      } else {
        this.selectedModules.add(id)
      }
    } else {
      this.selectedModules.clear()
      this.selectedModules.add(id)
    }

    this.render();
  }

  private handleMouseMove(e: MouseEvent): void {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Drag logic
    if (this.isResizing && this.activeResizeHandle) {
      // Calculate the new size based on the mouse position
      const newSize = Math.max(20,
        Math.min(
          this.canvas.width,
          this.canvas.height,
          mouseX - this.activeResizeHandle.x,
          mouseY - this.activeResizeHandle.y
        )
      );

      // Apply the resize effect
      this.activeResizeHandle.size = newSize;
      this.render();

      return
    }

    // console.log(this.editor.modules.entries())
    // hover logic
    const filtered = this.editor.modules.values().filter((module) => {
      const {top, right, bottom, left} = module.getBoundingRect()

      return mouseX > left && mouseY > top && mouseX < right && mouseY < bottom
    })
    // console.log(filtered);

    this.canvas.style.cursor = filtered.length > 0 ? "move" : 'default';
  }

  private handleMouseUp(): void {
    this.isSelectAll = false;
    this.isDragging = false;
    this.isResizing = false;
    this.activeResizeHandle = null; // Reset active resize handle
    this.render();
  }

  public render(): void {
    const enableRotationHandle = this.selectedModules.size === 1
    const {ctx} = this

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.setTransform(this.editor.scale, 0, 0, this.editor.scale, 0, 0);

    const BatchDrawer = (modules: Modules[]) => {
      const handlesQueue: Set<string> = new Set()
      // const rectQueue: Set<string> = new Set()
      const l = this.resizeHandleSize / 2
      const rects: RectangleRenderProps[] = []
      const fillStyle = "#5491f8";
      const strokeStyle = "#5491f8";
      const lineWidth = 1;
      ctx.save();

      if (enableRotationHandle) {
        // this.ctx.translate(item.x + item.size / 2, item.y + item.size / 2); // Move origin to center of item
        // this.ctx.rotate(item.rotation); // Apply rotation
      }

      modules.forEach((module) => {
        const {
          x, y, width, height
        } = module.getBoundingRect()

        handlesQueue.add(`${x}-${y}`);
        handlesQueue.add(`${x + width / 2}-${y}`);
        handlesQueue.add(`${x + width}-${y}`);
        handlesQueue.add(`${x + width}-${y + height / 2}`);
        handlesQueue.add(`${x + width}-${y + height}`);
        handlesQueue.add(`${x + width / 2}-${y + height}`);
        handlesQueue.add(`${x}-${y + height}`);
        handlesQueue.add(`${x}-${y + height / 2}`);

        rects.push({
          x, y, width, height, fillStyle,
          strokeStyle,
          lineWidth
        })
        // rectQueue.add(`${x}-${y}-${width}-${height}`);
      });

      // ctx.fillStyle = "#5491f8";
      // ctx.strokeStyle = "#5491f8";
      // ctx.lineWidth = 1;
      handlesQueue.forEach((s) => {
        const arr = s.split('-');
        const x = parseFloat(arr[0]);
        const y = parseFloat(arr[1]);


        ctx.beginPath();
        ctx.ellipse(x, y, l, l, 0, 0, 360);
        ctx.fill();
      })

      rectRender(ctx, rects)
      /*

            rectQueue.forEach((s) => {
              const arr = s.split('-');
              const x = parseFloat(arr[0]);
              const y = parseFloat(arr[1]);
              const width = parseFloat(arr[2]);
              const height = parseFloat(arr[3]);

              ctx.strokeRect(x, y, width, height);
            })
      */

      this.ctx.restore();
    }

    if (this.isSelectAll) {
      BatchDrawer(this.editor.modules)
    } else {
      const manipulationModules: Modules[] = [];

      this.selectedModules.forEach(id => {
        this.editor.modules.forEach((module) => {
          if (module.id === id) {
            manipulationModules.push(module)
          }
        })
      })

      BatchDrawer(manipulationModules)
    }
  }

  public clearSelectedItems(): void {
    this.selectedModules.clear();
    this.render()
  }

  /*  public setSelectedItems(modulesIdList: SelectionManager['selectedModules']): void {
      this.selectedModules.clear();

      modulesIdList.forEach((moduleId) => {
        this.selectedModules.add(moduleId)
      })
    }*/

  private destroy(): void {
    if (this.isDestroyed) return;

    this.unBindShortcuts()

    this.removeEventListeners();
    this.selectedModules.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.isDestroyed = true;
    console.log("SelectionModule destroyed.");
  }
}

export default SelectionManager;
