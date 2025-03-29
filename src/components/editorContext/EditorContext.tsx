import React, {createContext} from 'react'
import Editor from "../../engine/editor"
import {HistoryNode} from "../../engine/editor/history/DoublyLinkedList.ts"
import {ActionCode} from "../../engine/editor/type"

interface EditorContextType {
  focused: boolean
  historyArray: HistoryNode[]
  historyCurrent: HistoryNode
  selectedModules: UID[]
  selectedProps: ModuleProps
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  executeAction: (code: ActionCode) => void
}

const EditorContext = createContext<EditorContextType>({
  focused: false,
  historyArray: [] as HistoryNode[],
  historyCurrent: {} as HistoryNode,
  selectedModules: [],
  selectedProps: {},
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {

  },
  executeAction: () => {

  }
})

export default EditorContext