import React, {createContext} from 'react'
import {Editor} from '@lite-u/editor'
import {HistoryNode, VisionEventData, VisionEventType} from '@lite-u/editor/types'
import {WorkspaceAction, WorkSpaceStateType, initialWorkspaceState} from './reducer/reducer.ts'

interface WorkspaceContextType {
  state: WorkSpaceStateType
  dispatch: React.Dispatch<WorkspaceAction>;

  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  // executeAction: <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => void
  executeAction: <K extends VisionEventType>(type: K, data?: VisionEventData<K>) => void
  // viewport: ViewportInfo
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  state: initialWorkspaceState,
  dispatch: () => {},
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {},
  executeAction: () => {},
})

export default WorkspaceContext