import React, {createContext} from 'react'
import Editor from '../../engine/editor/editor.ts'
import {HistoryNode} from '../../engine/editor/history/DoublyLinkedList.ts'
import {ViewportInfo} from '../../engine/editor/type'
import {EditorEventData, EditorEventType} from '../../engine/editor/actions/type'

interface EditorContextType {
  focused: boolean
  historyArray: HistoryNode[]
  historyCurrent: HistoryNode['id']
  selectedModules: UID[]
  selectedProps: ModuleProps
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  // executeAction: <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => void
  executeAction: <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => void
  viewport: ViewportInfo
}

const EditorContext = createContext<EditorContextType>({
  focused: false,
  historyArray: [] as HistoryNode[],
  historyCurrent: 0,
  selectedModules: [],
  selectedProps: {},
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {

  },
  executeAction: () => {

  },
  viewport: {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    dx: 0,
    dy: 0,
    status: '',
  },
})

export default EditorContext