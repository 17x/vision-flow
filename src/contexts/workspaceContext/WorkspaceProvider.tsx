import {FC, useEffect, useRef, useState} from 'react'
import {VisionFileType, VisionWorkspace} from '../fileContext/FileContext.tsx'
import WorkspaceContext, {useWorkspace} from './WorkspaceContext.tsx'
import {Con} from '@lite-u/ui'
import EditorProvider from '../editorContext/EditorProvider.tsx'
import {VisionEventData, VisionEventType} from '@editor/engine/actions/type'
import {Print} from '../../components/print/print.tsx'
import Editor from '@editor/engine/editor.ts'
import saveFileHelper from './saveFileHelper.ts'
// import {useUI} from '../UIContext/UIContext.tsx'

const WorkspaceProvider: FC<{ file: VisionFileType }> = ({file}) => {
  const {workspaceList, pageConfig} = useWorkspace()
  const workspaceRef = useRef(new Map())
  const [creating, setCreating] = useState<boolean>(false)
  const [focusedId, setFocusedId] = useState<UID>('')
  const [workspace, setWorkspace] = useState<VisionWorkspace[]>([])
  const editorMapRef = useRef<Map<string, Editor>>(new Map())
  // const {dpr} = useUI()
  const [currentWS, setCurrentWS] = useState<string>(file.workspace[0].id)
  const [showPrint, setShowPrint] = useState(false)

  useEffect(() => {
    setWorkspace(file.workspace)
  }, [])

  const focusOnWorkspace = (id: UID) => {
    setFocusedId(id)
  }

  const closeWorkspace = (deletingId: UID) => {
    let ws = workspaceRef.current.get(deletingId)

    workspaceRef.current.delete(deletingId)
    console.log(ws)
    // const deletingFileIndex = workspaceList.findIndex(file => file.id === deletingId)
    // let len = workspaceList.length
    //
    // if (deletingFileIndex === -1) return

    // deleteFileFromLocal(deletingId)
    // fileMap.current.delete(deletingId)
    // updateFileList()
    // workspaceList.splice(deletingFileIndex, 1)
    // len--
    /*
        if (focusedId === deletingId && len > 0) {
          let newOpenFileIndex: number = deletingFileIndex + 1

          if (deletingFileIndex === 0) {
            newOpenFileIndex = 0
          }
          if (newOpenFileIndex > len) {
            newOpenFileIndex = len - 1
          }

          setFocusedId(workspaceList[newOpenFileIndex].id)
        }*/
  }

  const createWorkspace = (ws: VisionWorkspace) => {
    // fileMap.current.set(file.id, file)
    // updateFileList()
    focusOnWorkspace(file.id)
    // setCurrentFileId(file.id)
  }

  const startCreateFile = () => {
    setCreating(true)
  }

  const handleCreating = (v: boolean) => {
    setCreating(v)
  }

  const saveFile = () => {
    console.log(9)
    // const e = editorMapRef.current.get(currentWS)
    const workspaceList = []

    workspace.map(WS => {
      const e = editorMapRef.current.get(WS.id)
      const data = e?.export()

      workspaceList.push({
        ...WS,
        ...data,
      })
    })
    console.log(file)
    saveFileHelper(file, workspaceList)
  }

  const executeAction = <K extends (VisionEventType & WorkspaceAction)>(type: K, data?: VisionEventData<K>) => {
    console.log(type)

    if (type === 'print') {
      setShowPrint(true)
      return
    }

    if (type === 'newFile') {
      startCreateFile()
      return
    }

    if (type === 'closeFile') {
      closeFile(data.id)
      return
    }

    if (type === 'saveFile') {
      console.log(9)
    }
    const currentWSEditor = editorMapRef.current.get(currentWS)

    if (currentWSEditor) {
      console.log(currentWS, editorMapRef)
      console.log(currentWSEditor)
      // console.log(editorMapRef.current.get(currentWS).current)
      currentWSEditor.execute(type as K, data)
    }
  }

  return <WorkspaceContext.Provider value={{
    creating,
    focused: focusedId,
    // closeFile,
    executeAction,
    saveFile,
    create: createWorkspace,
    startCreateFile,
    handleCreating,
  }}>
    <Con fw fh onDragOver={(e) => {
      e.preventDefault()
      e.stopPropagation()
    }}>
      {
        workspace.map((ws, index) => {
          return <EditorProvider ref={(ref) => {
            editorMapRef.current.set(ws.id, ref)
          }} workspace={ws} fileId={file.id} page={file.config.page} key={index}/>
        })
      }
    </Con>

    {showPrint && <Print editorRef={editorRef} onClose={() => {
      setShowPrint(false)
    }}/>}
  </WorkspaceContext.Provider>
}

export default WorkspaceProvider