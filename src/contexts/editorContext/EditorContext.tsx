import React, {createContext} from 'react'
import {Editor} from '@lite-u/editor'
import {HistoryNode, VisionEventData, VisionEventType} from '@lite-u/editor/types'
import {EditorAction, EditorStateType, initialEditorState} from './reducer/reducer.ts'

interface EditorContextType {
  state: EditorStateType
  dispatch: React.Dispatch<EditorAction>;

  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  // executeAction: <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => void
  executeAction: <K extends VisionEventType>(type: K, data?: VisionEventData<K>) => void
  // viewport: ViewportInfo
}

const EditorContext = createContext<EditorContextType>({
  state: initialEditorState,
  dispatch: () => {},
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {},
  executeAction: () => {},
})

export default EditorContext