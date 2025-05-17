import React, {createContext} from 'react'
import Editor from '@lite-u/editor/engine/editor.ts'
import {HistoryNode} from '@lite-u/editor/engine/history/DoublyLinkedList.ts'
import {VisionEventData, VisionEventType} from '@lite-u/editor/engine/actions/type'
import {EditorStateType, initialEditorState} from './reducer/reducer.ts'

interface EditorContextType {
  state: EditorStateType
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  // executeAction: <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => void
  executeAction: <K extends VisionEventType>(type: K, data?: VisionEventData<K>) => void
  // viewport: ViewportInfo
}

const EditorContext = createContext<EditorContextType>({
  state: initialEditorState,
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {},
  executeAction: () => {},
})

export default EditorContext