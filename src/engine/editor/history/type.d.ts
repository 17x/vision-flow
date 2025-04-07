type HistoryPrev = HistoryNode | null
type HistoryNext = HistoryPrev
type HistorySelectedModules = Set<UID> | 'all'
type HistoryModules = ModuleProps[] | UID[]

export type HistoryOperationType =
  | 'init'
  | 'add'
  | 'delete'
  | 'paste'
  | 'duplicate'
  | 'modify'
  | 'move'
  | 'reorder'
  | 'select'
  | 'group'
  | 'ungroup'
  | 'composite'

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
  type: 'init'
  payload: {
    state: null,
    selectedModules: HistorySelectedModules
    // state: ModuleMap // full initial state of the modules
    // HistorySelectedModules
  }
}

// 2. Adding modules to the system
interface AddOperation {
  type: 'add'
  payload: {
    modules: HistoryModules // newly added modules with their full data
    selectedModules: HistorySelectedModules
  }
}

// 3. Deleting modules from the system
interface DeleteOperation {
  type: 'delete'
  payload: {
    modules: HistoryModules // full data of deleted modules, to restore them
    selectedModules: HistorySelectedModules
  }
}

// 4. Pasting modules into the scene
interface PasteOperation {
  type: 'paste'
  payload: {
    modules: HistoryModules // modules that were pasted into the scene
    selectedModules: HistorySelectedModules
  }
}

// 5. Duplicating modules
interface DuplicateOperation {
  type: 'duplicate'
  payload: {
    // sourceIds: string[] // ids of the original modules being duplicated
    modules: HistoryModules  // the new duplicated modules
    selectedModules: HistorySelectedModules
  }
}

// 6. Modifying module properties
interface ModifyOperation {
  type: 'modify'
  payload: {
    changes: {
      id: string // module ID that was modified
      props: {
        [key: string]: {
          from: never // previous value of the property
          to: never   // new value of the property
        }
      }
    }[]
    selectedModules: HistorySelectedModules
  }
}

// 7. Moving modules
interface MoveOperation {
  type: 'move'
  payload: {
    delta: { x: number, y: number } // amount by which to move (x and y deltas)
    modules: HistoryModules // ids of the modules to move
    selectedModules: HistorySelectedModules
  }
}

// 8. Reordering modules
interface ReorderOperation {
  type: 'reorder'
  payload: {
    from: string[] // old order of module ids
    to: string[]   // new order of module ids
    selectedModules: HistorySelectedModules
  }
}

// 9. Selecting modules
/*interface SelectOperation {
  type: 'select'
  payload: {
    from: string[] // Previously selected module IDs
    to: string[]   // Currently selected module IDs
  }
}*/

// 10. Grouping modules together
interface GroupOperation {
  type: 'group'
  payload: {
    groupId: string // ID of the newly created group
    children: string[] // IDs of the modules being grouped
    selectedModules: HistorySelectedModules
  }
}

// 11. Ungrouping modules
interface UngroupOperation {
  type: 'ungroup'
  payload: {
    groupId: string // ID of the group being ungrouped
    children: HistoryModules // full modules being ungrouped
    selectedModules: HistorySelectedModules
  }
}

// 12. Composite operation (group multiple actions as one)
interface CompositeOperation {
  type: 'composite'
  payload: {
    actions: HistoryOperationA[] // list of actions to be treated as a single undo/redo unit
    selectedModules: HistorySelectedModules
  }
}