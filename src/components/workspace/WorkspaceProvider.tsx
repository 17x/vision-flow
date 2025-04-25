import {FC, useEffect, useRef, useState} from 'react'
import {VisionFileType, VisionWorkspace} from '../fileContext/FileContext.tsx'
import WorkspaceContext from './WorkspaceContext.tsx'
import {Col, Row} from '@lite-u/ui'
import EditorProvider from '../editorContext/EditorProvider.tsx'

const WorkspaceProvider: FC<{ file: VisionFileType }> = ({file}) => {
  // const [workspaceList, setWorkspaceList] = useState<VisionWorkspace[]>([])
  const workspaceRef = useRef(new Map())
  const [creating, setCreating] = useState<boolean>(false)
  const [focusedId, setFocusedId] = useState<UID>('')
  // const {focusedFileId} = useFile()
  const [workspace, setWorkspace] = useState<VisionWorkspace[]>([])

  useEffect(() => {
    // console.log(file.workspace)
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

  return (
    <WorkspaceContext.Provider value={{
      creating,
      focused: focusedId,
      // closeFile,
      create: createWorkspace,
      startCreateFile,
      handleCreating,
    }}>
      <Col>
        {/*<EditorProvider data={file}/>*/}
        <Row>
          {
            workspace.map((ws, index) => {
              return <EditorProvider data={ws} key={index}/>
            })
          }
        </Row>
        <Row>
          {
            workspace.map((ws, index) => {
              return <span key={index}>{ws.name}</span>
            })
          }
        </Row>
      </Col>
    </WorkspaceContext.Provider>
  )
}

export default WorkspaceProvider