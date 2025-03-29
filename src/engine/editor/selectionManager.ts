import Editor from "./index.ts";
import coordinator from "./coordinator.ts";
import {ActionCode, ModifyModuleMap} from "./editor";
import rectRender, {RectangleRenderProps} from "../core/renderer/rectRender.ts";

type CopiedModuleProps = Omit<ModuleProps, 'id'>
type KeyboardDirectionKeys = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
const actions: ActionCode[] = [
  'selectAll',
  'copy',
  'paste',
  'duplicate',
  'delete',
  'escape',
  'modify-modules'
];
const CopyDeltaX = 10
const CopyDeltaY = 10

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
  private copiedItems: ModuleProps[] = []
  private isSelectAll: boolean = false
  private currentCopyDeltaX = CopyDeltaX
  private currentCopyDeltaY = CopyDeltaY

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

    // this.watchActions()
    this.render();
    this.setupEventListeners();
  }

  /*  private watchActions() {
      actions.forEach(action => {
        // this.editor.action.subscribe(action, this[action].bind(this));
      });
    }*/

  private unBindShortcuts() {
    this.editor.action.unsubscribe('selectAll', this.selectAll.bind(this));
    this.editor.action.unsubscribe('copy', this.copy.bind(this));
    this.editor.action.unsubscribe('paste', this.paste.bind(this));
    this.editor.action.unsubscribe('duplicate', this.duplicate.bind(this));
    this.editor.action.unsubscribe('delete', this.delete.bind(this));
    this.editor.action.unsubscribe('escape', this.escape.bind(this));
    this.editor.action.unsubscribe('modify-modules', this.modifyModules.bind(this));
  }

  public getSelected(): Set<UID> {
    return new Set(this.selectedModules.keys())
  }

  public select(idSet: Set<UID>) {
    if (!idSet) return
    // console.log(idSet)
    this.selectedModules.clear()
    idSet.forEach((id) => {
      this.selectedModules.add(id);
    })
    this.render();
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
  }

  public selectAll(): void {
    this.selectedModules.clear()
    this.isSelectAll = true
    this.render();
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
  }

  public clear(): void {
    this.selectedModules.clear()
    this.isSelectAll = false
    this.render();
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
  }

  public copy(): void {
    this.copiedItems = []

    this.copiedItems = this.editor.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsDelta()
  }

  public paste(): void {
    const newModules = this.editor.batchCreate(this.copiedItems)
    this.editor.batchAdd(newModules, 'paste-modules')
    this.select(new Set(newModules.keys()))
    this.updateCopiedItemsDelta()
  }

  public duplicate(): void {
    let temp: ModuleProps[]

    if (this.isSelectAll) {
      temp = this.editor.batchCopy('all', true)
    } else {
      temp = this.editor.batchCopy(this.selectedModules, true)
    }

    temp.forEach(copiedItem => {
      copiedItem!.x += CopyDeltaX
      copiedItem!.y += CopyDeltaY
    })

    const newModules = this.editor.batchCreate(temp)
    this.editor.batchAdd(newModules, 'duplicate-modules')
    this.isSelectAll = false
    this.select(new Set(newModules.keys()))
  }

  public delete(): void {
    if (this.isSelectAll) {
      this.editor.batchDelete('all', 'delete-modules')
    } else {
      this.editor.batchDelete(this.selectedModules, 'delete-modules')
    }

    this.editor.selectionManager.clear()
  }

  private escape(): void {
    this.isSelectAll = false
    this.clear()
  }

  private modifyModules(e: KeyboardEvent, i?: KeyboardDirectionKeys): void {
    const offsetX = 10
    const offsetY = 10
    const modifyData: { x?: number, y?: number } = {}

    if (this.selectedModules.size > 0 || this.isSelectAll) {
      e.preventDefault()
    } else {
      return
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
    } else if (this.selectedModules.size > 0) {
      this.editor.batchModify(this.selectedModules, modifyData, 'modify-modules')
    }

    this.render()
  }

  private updateCopiedItemsDelta(): void {
    this.copiedItems.forEach(copiedItem => {
      copiedItem!.x += CopyDeltaX
      copiedItem!.y += CopyDeltaY
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

    const possibleModules = Array.from(this.editor.moduleMap.values()).filter((item) => {
      const {
        top, right, bottom, left
      } = item.getBoundingRect()

      return mouseX > left && mouseY > top && mousePointX < right && mousePointY < bottom
    })

    if (!possibleModules.length) {
      this.clear();
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
    this.editor.events.onSelectionUpdated?.(this.selectedModules)
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
    const filtered = this.editor.moduleMap.values().filter((module) => {
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

    const BatchDrawer = (modules: ModuleMap) => {
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
      BatchDrawer(this.editor.moduleMap)
    } else {
      const manipulationModules: ModuleMap = new Map();

      this.selectedModules.forEach(id => {
        this.editor.moduleMap.forEach((module) => {
          if (module.id === id) {
            manipulationModules.set(module.id, module)
          }
        })
      })

      BatchDrawer(manipulationModules)
    }
  }

  public handleKeyboardMove(modules): void {

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
