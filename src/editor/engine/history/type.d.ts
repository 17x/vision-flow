import {HistoryModuleChangeItem, HistoryModuleChangeProps, ModuleModifyData} from '../actions/type'

type HistoryPrev = HistoryNode | null
type HistoryNext = HistoryPrev
type HistorySelectedModules = Set<UID>
type HistoryModules = ModuleProps[] | UID[]

export type HistoryOperationType =
  'history-init'
  | 'history-add'
  | 'history-delete'
  | 'history-paste'
  | 'history-duplicate'
  | 'history-modify'
  | 'history-move'
  | 'history-reorder'
  | 'history-select'
  | 'history-group'
  | 'history-ungroup'
  | 'history-composite'

// 🧱 Base HistoryOperation Union with Selection Tracking
export type HistoryOperation =
  | InitOperation
  | AddOperation
  | DeleteOperation
  | PasteOperation
  | DuplicateOperation
  | ModifyOperation
  | MoveOperation
  | ReorderOperation
  // | SelectOperation
  | GroupOperation
  | UngroupOperation
  | CompositeOperation

// 🔧 Action Definitions

// 1. Initialization of state
interface InitOperation {
  type: 'history-init'
  payload: {
    state: null,
    selectedModules: HistorySelectedModules
    // state: ModuleMap // full initial state of the modules
    // HistorySelectedModules
  }
}

// 2. Adding modules to the system
interface AddOperation {
  type: 'history-add'
  payload: {
    modules: HistoryModules // newly added modules with their full data
    selectedModules: HistorySelectedModules
  }
}

// 3. Deleting modules from the system
interface DeleteOperation {
  type: 'history-delete'
  payload: {
    modules: HistoryModules // full data of deleted modules, to restore them
    selectedModules: HistorySelectedModules
  }
}

// 4. Pasting modules into the scene
interface PasteOperation {
  type: 'history-paste'
  payload: {
    modules: HistoryModules // modules that were pasted into the scene
    selectedModules: HistorySelectedModules
  }
}

// 5. Duplicating modules
interface DuplicateOperation {
  type: 'history-duplicate'
  payload: {
    // sourceIds: string[] // ids of the original modules being duplicated
    modules: HistoryModules  // the new duplicated modules
    selectedModules: HistorySelectedModules
  }
}

// 6. Modifying module properties
interface ModifyOperation {
  type: 'history-modify'
  payload: {
    changes: HistoryModuleChangeItem[]
    selectedModules: HistorySelectedModules
  }
}

// 7. Moving modules
interface MoveOperation {
  type: 'history-move'
  payload: {
    delta: { x: number, y: number } // amount by which to move (x and y deltas)
    // modules: HistoryModules // ids of the modules to move
    selectedModules: HistorySelectedModules
  }
}

// 8. Reordering modules
interface ReorderOperation {
  type: 'history-reorder'
  payload: {
    from: string[] // old order of module ids
    to: string[]   // new order of module ids
    selectedModules: HistorySelectedModules
  }
}

// 9. Selecting modules
/*interface SelectOperation {
  type: 'history-select'
  payload: {
    from: string[] // Previously selected module IDs
    to: string[]   // Currently selected module IDs
  }
}*/

// 10. Grouping modules together
interface GroupOperation {
  type: 'history-group'
  payload: {
    groupId: string // ID of the newly created group
    children: string[] // IDs of the modules being grouped
    selectedModules: HistorySelectedModules
  }
}

// 11. Ungrouping modules
interface UngroupOperation {
  type: 'history-ungroup'
  payload: {
    groupId: string // ID of the group being ungrouped
    children: HistoryModules // full modules being ungrouped
    selectedModules: HistorySelectedModules
  }
}

// 12. Composite operation (group multiple actions as one)
interface CompositeOperation {
  type: 'history-composite'
  payload: {
    actions: HistoryOperationA[] // list of actions to be treated as a single undo/redo unit
    selectedModules: HistorySelectedModules
  }
}