import {HistoryNode} from '../../../engine/editor/history/DoublyLinkedList.ts'

// import {ViewportInfo} from '../../../engine/editor/type'

export interface EditorStateType {
  id: UID
  focused: boolean
  historyArray: HistoryNode[]
  historyStatus: {
    id: number
    hasPrev: boolean
    hasNext: boolean
  },
  worldPoint: Point,
  needSave: boolean
  selectedModules: UID[]
  selectedProps: ModuleProps | null
  lastSavedHistoryId: number
  copiedItems: ModuleProps[]
  viewport: ViewportInfo | null
}

export const initialEditorState: EditorStateType = {
  id: '',
  focused: false,
  selectedProps: null,
  selectedModules: [],
  viewport: null,
  lastSavedHistoryId: -1,
  needSave: false,
  worldPoint: {x: 0, y: 0},
  copiedItems: [],
  historyArray: [],
  historyStatus: {
    id: 0,
    hasPrev: false,
    hasNext: false,
  },
}

type EditorAction =
  { type: 'SET_ID'; payload: UID }
  | { type: 'SET_HISTORY_STATUS'; payload: { id: number; hasPrev: boolean; hasNext: boolean } }
  | { type: 'SET_FOCUSED'; payload: boolean }
  | { type: 'SET_HISTORY_ARRAY'; payload: HistoryNode[] }
  | { type: 'SET_NEED_SAVE'; payload: boolean }
  | { type: 'SET_SELECTED_MODULES'; payload: UID[] }
  | { type: 'SET_SELECTED_PROPS'; payload: ModuleProps | null }
  | { type: 'SET_LAST_SAVED_HISTORY_ID'; payload: number }
  | { type: 'SET_COPIED_ITEMS'; payload: ModuleProps[] }
  | { type: 'SET_VIEWPORT'; payload: ViewportInfo | null }
  | { type: 'SET_WORLD_POINT'; payload: Point };

export const EditorReducer = (state: EditorStateType, action: EditorAction) => {
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

    default:
      return state
  }
}