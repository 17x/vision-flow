import {FC, ReactNode, RefObject, useContext, useEffect, useMemo, useReducer, useRef, useState} from 'react'
import {Editor} from '@lite-u/editor'
import {VisionEventData, VisionEventType} from '@lite-u/editor/types'
import AppContext, {VisionWorkspace} from '../appContext/AppContext.tsx'
import WorkspaceContext from './WorkspaceContext.tsx'
import {EditorReducer, initialWorkspaceState} from './reducer/reducer.ts'
import Workspace from '../../components/workspace/Workspace.tsx'

const WorkspaceProvider: FC<{
  ref: RefObject<Editor>,
  workspace: VisionWorkspace,
  fileId: UID,
  page: EditorConfig['page']
  children: ReactNode
}> = ({
        children,
        ref,
        workspace,
        fileId,
        page,
      }) => {
  const {focusedFileId, startCreateFile, closeFile} = useContext(AppContext)
  const [state, dispatch] = useReducer(EditorReducer, initialWorkspaceState)
  const editorRef = useRef<Editor>(null)
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)

  const executeAction = <K extends VisionEventType>(type: K, data?: VisionEventData<K>) => {
    if (type === 'newFile') {
      startCreateFile()
      return
    }

    if (type === 'closeFile') {
      closeFile(data.id)
      return
    }

    editorRef.current!.execute(type as K, data)
  }

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    editorRef,
    executeAction,
  }), [state, executeAction])

  useEffect(() => {
   }, [])

  return <WorkspaceContext.Provider value={contextValue}>
    <Workspace/>
  </WorkspaceContext.Provider>
}

export default WorkspaceProvider