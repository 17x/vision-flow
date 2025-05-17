export interface WorkSpaceStateType {
  id: UID
  focused: boolean
  historyArray: HistoryNode[]
  historyStatus: {
    id: number
    hasPrev: boolean
    hasNext: boolean
  },
  worldPoint: Point,
  worldScale: number,
  needSave: boolean
  selectedModules: UID[]
  selectedProps: ElementProps | null
  currentTool: ToolName
  lastSavedHistoryId: number
  copiedItems: ElementProps[]
  // viewport: ViewportInfo | null
}

export const initialWorkspaceState: WorkSpaceStateType = {
  id: '',
  focused: false,
  selectedProps: null,
  selectedModules: [],
  lastSavedHistoryId: -1,
  needSave: false,
  worldPoint: {x: 0, y: 0},
  worldScale: 1,
  copiedItems: [],
  historyArray: [],
  // currentTool: 'zoomIn',
  currentTool: 'rectangle',
  // currentTool: 'ellipse',
  // currentTool: 'text',
  // currentTool: 'lineSegment',
  // currentTool: 'pencil',
  // viewport: null,
  historyStatus: {
    id: 0,
    hasPrev: false,
    hasNext: false,
  },
}

export type WorkspaceAction =
  { type: 'SET_ID'; payload: UID }
  | { type: 'SET_HISTORY_STATUS'; payload: { id: number; hasPrev: boolean; hasNext: boolean } }
  | { type: 'SET_FOCUSED'; payload: boolean }
  | { type: 'SET_HISTORY_ARRAY'; payload: HistoryNode[] }
  | { type: 'SET_NEED_SAVE'; payload: boolean }
  | { type: 'SET_SELECTED_MODULES'; payload: UID[] }
  | { type: 'SET_SELECTED_PROPS'; payload: ElementProps | null }
  | { type: 'SET_LAST_SAVED_HISTORY_ID'; payload: number }
  | { type: 'SET_COPIED_ITEMS'; payload: ElementProps[] }
  | { type: 'SET_VIEWPORT'; payload: ViewportInfo | null }
  | { type: 'SET_WORLD_POINT'; payload: Point }
  | { type: 'SET_WORLD_SCALE'; payload: number }
  | { type: 'SET_CURRENT_TOOL'; payload: ToolName };

export const WorkspaceReducer = (state: WorkSpaceStateType, action: WorkspaceAction) => {
  switch (action.type) {
    case 'SET_ID':
      return {
        ...state,
        id: action.payload,
      }
    case 'SET_HISTORY_STATUS':
      return {
        ...state,
        historyStatus: {
          ...state.historyStatus,
          ...action.payload,
        },
      }
    case 'SET_FOCUSED':
      // console.log(state,action.payload)
      return {
        ...state,
        focused: action.payload,
      }
    case 'SET_HISTORY_ARRAY':
      return {
        ...state,
        historyArray: action.payload,
      }
    case 'SET_NEED_SAVE':
      return {
        ...state,
        needSave: action.payload,
      }
    case 'SET_SELECTED_MODULES':
      return {
        ...state,
        selectedModules: action.payload,
      }
    case 'SET_SELECTED_PROPS':
      return {
        ...state,
        selectedProps: action.payload,
      }
    case 'SET_LAST_SAVED_HISTORY_ID':
      return {
        ...state,
        lastSavedHistoryId: action.payload,
      }
    case 'SET_COPIED_ITEMS':
      return {
        ...state,
        copiedItems: action.payload,
      }
    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: action.payload,
      }
    case 'SET_WORLD_POINT':
      return {
        ...state,
        worldPoint: action.payload,
      }
    case 'SET_WORLD_SCALE':
      return {
        ...state,
        worldScale: action.payload,
      }

    case 'SET_CURRENT_TOOL':
      return {
        ...state,
        currentTool: action.payload,
      }

    default:
      return state
  }
}