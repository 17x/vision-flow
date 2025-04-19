import React, {createContext} from 'react'
import {EditorStateType, initialEditorState} from './reducer/reducer.ts'

interface EditorContextType {
  state: EditorStateType
  /*focused: boolean
  historyArray: HistoryNode[]
  historyStatus: {
    id: number
    hasPrev: boolean
    hasNext: boolean
  },
  needSave: boolean
  selectedModules: UID[]
  selectedProps: ModuleProps
  copiedItems: selectedProps[],*/
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  // executeAction: <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => void
  executeAction: <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => void
  // viewport: ViewportInfo
}

const EditorContext = createContext<EditorContextType>({
  state: initialEditorState,
  /*focused: false,
  historyArray: [] as HistoryNode[],
  historyStatus: {
    id: 0,
    hasPrev: false,
    hasNext: false,
  },
  selectedModules: [],
  selectedProps: {},
  copiedItems: [],
  needSave: false,*/
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {

  },
  executeAction: () => {

  },
  /*viewport: {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    dx: 0,
    dy: 0,
    status: '',
  },*/
})

export default EditorContext