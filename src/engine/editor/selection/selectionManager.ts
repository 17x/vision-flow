import Editor from '../editor.ts'
import typeCheck from '../../../utilities/typeCheck.ts'
import {getBoxControlPoints} from '../../lib/lib.ts'
import {RectangleProps} from '../../core/modules/shapes/rectangle.ts'
import {OperationHandler, SelectionActionMode} from './type'
import {ModuleSelectData} from '../actions/type'

const CopyDeltaX = 50
const CopyDeltaY = 100

class SelectionManager {
  readonly selectedModules: Set<UID> = new Set()
  readonly visibleSelectedModules: Set<UID> = new Set()
  readonly operationHandlers: Set<OperationHandler> = new Set()
  resizeHandleSize: number = 10
  activeResizeHandle: { x: number, y: number } | null = null
  isDestroyed: boolean = false
  editor: Editor
  copiedItems: ModuleProps[] = []
  isSelectAll: boolean = false

  constructor(editor: Editor) {
    this.editor = editor
    this.init()
  }

  init() {
    this.editor.action.on('editor-visible-module-update', (/*visibleModuleMap*/) => {
      // this.updateVisibleSelectedModules(visibleModuleMap as ModuleMap)
      this.updateVisibleSelectedModules()
      this.editor.action.dispatch({
        type: 'editor-visible-selection-update',
        data: {
          idSet: this.getVisibleSelectedModules(),
          operators: this.operationHandlers,
        },
      })
    })

    this.editor.action.on('module-select-all', () => {
      this.selectedModules.clear()
      this.isSelectAll = true

      // this.updateVisibleSelectedModules(visibleModuleMap as ModuleMap)
      this.updateVisibleSelectedModules()
      this.editor.action.dispatch({
        type: 'editor-visible-selection-update',
        data: {
          idSet: this.getVisibleSelectedModules(),
          operators: this.operationHandlers,
        },
      })

      this.editor.events.onSelectionUpdated?.('all', null)
    })

    this.editor.action.on('module-select', (data) => {
      // console.log(data.mode as SelectionActionMode)
      const {mode, idSet} = data as ModuleSelectData

      if (mode === 'toggle') {

        console.log(mode, idSet)
      }
      this.modifySelection(idSet, mode)
      this.updateVisibleSelectedModules()
      this.editor.action.dispatch({
        type: 'editor-visible-selection-update',
        data: {
          idSet: this.getVisibleSelectedModules(),
          operators: this.operationHandlers,
        },
      })
    })
  }

  public getSelected(): Set<UID> | 'all' {
    if (this.isSelectAll) {
      return 'all'
    }
    return new Set(this.selectedModules.keys())
  }

  public modifySelection(idSet: Set<UID>, action: SelectionActionMode) {
    if (typeCheck(idSet) !== 'set' || idSet.size <= 0) return

    let eventCallBackData = null

    if (idSet.size === 1) {
      const first = [...idSet.values()][0]

      if (this.editor.moduleMap.has(first)) {
        eventCallBackData = this.editor.moduleMap.get(first).getDetails()
        // console.log(eventCallBackData)
      }
    }

    if (action === 'replace') {
      this.selectedModules.clear()
    }

    idSet.forEach((id) => {
      switch (action) {
        case 'add':
          this.selectedModules.add(id)
          break
        case 'delete':
          this.selectedModules.delete(id)
          break
        case 'toggle':
          if (this.selectedModules.has(id)) {
            this.selectedModules.delete(id)
          } else {
            this.selectedModules.add(id)
          }
          break
        case 'replace':
          this.selectedModules.add(id) // Add the new selection
          break
      }
    })

    // this.update()
    this.editor.events.onSelectionUpdated?.(idSet, eventCallBackData)
  }

  public add(idSet: Set<UID>) {
    this.modifySelection(idSet, 'add')
  }

  public delete(idSet: Set<UID>) {
    this.modifySelection(idSet, 'delete')
  }

  public toggle(idSet: Set<UID>) {
    this.modifySelection(idSet, 'toggle')
  }

  public replace(idSet: Set<UID>) {
    this.modifySelection(idSet, 'replace')
  }

  public selectAll(): void {
    this.selectedModules.clear()
    this.isSelectAll = true
    this.update()
    this.editor.events.onSelectionUpdated?.('all', null)
  }

/*  public clear(): void {
    this.selectedModules.clear()
    this.isSelectAll = false
    // this.update()
    this.editor.events.onSelectionUpdated?.(new Set(), null)
  }*/

  public copySelected(): void {
    this.copiedItems = []

    this.copiedItems = this.editor.batchCopy(this.isSelectAll ? 'all' : this.selectedModules, true)
    this.updateCopiedItemsDelta()
  }

  public pasteCopied(): void {
    const newModules = this.editor.batchCreate(this.copiedItems)
    this.editor.batchAdd(newModules, 'history-paste')
    this.replace(new Set(newModules.keys()))
    this.updateCopiedItemsDelta()
  }

  public duplicateSelected(): void {
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
    this.editor.batchAdd(newModules, 'history-duplicate')
    this.isSelectAll = false
    this.replace(new Set(newModules.keys()))
  }

  public removeSelected(): void {
    if (this.isSelectAll) {
      this.editor.batchDelete('all', 'history-delete')
    } else {
      this.editor.batchDelete(this.selectedModules, 'history-delete')
    }

    // this.editor.selectionManager.clear()
  }

  private updateCopiedItemsDelta(): void {
    this.copiedItems.forEach(copiedItem => {
      copiedItem!.x += CopyDeltaX
      copiedItem!.y += CopyDeltaY
    })
  }

  public getIfUnique() {
    if (this.selectedModules.size === 1) return [...this.selectedModules.values()][0]
    return null
  }

  public update() {
    console.log(9)
    // this.updateVisibleSelectedModules()
    this.render()
  }

  public updateVisibleSelectedModules(/*visibleModuleMap: ModuleMap*/) {
    const visibleModuleMap = this.editor.getVisibleModuleMap()
    this.visibleSelectedModules.clear()
    this.operationHandlers.clear()

    visibleModuleMap.forEach(module => {
      if (module.type === 'rectangle') {
        const {x, y, id, width, height, rotation} = module as RectangleProps
        const points = getBoxControlPoints(x, y, width, height, rotation)

        points.forEach(point => {
          // create manipulation handlers
          this.operationHandlers.add(
            {
              id,
              type: 'resize',
              data: {
                ...point,
                r: this.editor.viewport.scale,
              },
            },
          )
        })
      }

      if (this.isSelectAll) {
        visibleModuleMap.forEach(module => {
          this.visibleSelectedModules.add(module.id)
        })
      } else {
        if (this.selectedModules.has(module.id)) {
          this.visibleSelectedModules.add(module.id)
        }
      }
    })
  }

  public getVisibleSelectedModules() {
    return new Set(this.visibleSelectedModules)
  }

  render() {
    this.editor.viewport.resetSelectionCanvas()
    this.editor.viewport.renderSelectionCanvas()
    // render.call(this)
  }

  destroy(): void {
    if (this.isDestroyed) return

    // this.removeEventListeners()
    this.selectedModules.clear()
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.isDestroyed = true
    console.log('SelectionModule destroyed.')
  }
}

export default SelectionManager
