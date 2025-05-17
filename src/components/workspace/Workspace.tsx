import ShortcutListener from '../ShortcutListener.tsx'
import Header from '../header/Header.tsx'
import {Col, Row} from '../../../../@lite-u/ui/src'
import Toolbar from '../toolbar/Toolbar.tsx'
import FileReceiver from '../fileReceiver.tsx'
import {PointRef, StatusBar} from '../statusBar/StatusBar.tsx'
import {ContextMenu} from '../contextMenu/ContextMenu.tsx'
import PropPanel from '../propPanel/PropPanel.tsx'
import {LayerPanel} from '../layerPanel/LayerPanel.tsx'
import {HistoryPanel} from '../historyPanel/HistoryPanel.tsx'
import {FC, RefObject, useContext, useRef, useState} from 'react'
import useEditor from '../../hooks/useEditor.tsx'
import useZoom from '../../hooks/useZoom.tsx'
import AppContext, {VisionWorkspace} from '../../contexts/appContext/AppContext.tsx'
import {Editor} from '@lite-u/editor'
import WorkspaceContext from '../../contexts/workspaceContext/WorkspaceContext.tsx'

const Workspace: FC<{
  ref: RefObject<Editor>,
  workspace: VisionWorkspace,
  fileId: UID,
  page: EditorConfig['page']
}> = ({
        ref,
        workspace,
        fileId,
        page,
      }) => {
  const {focusedFileId, startCreateFile, closeFile} = useContext(AppContext)
  const {state, dispatch} = useContext(WorkspaceContext)
  const contextRootRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const worldPointRef = useRef<PointRef | null>(null)
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const editorRef = useEditor(containerRef, workspace, page)

  const applyHistoryNode = (node: HistoryNode) => {
    if (editorRef.current) {
      editorRef.current.execute('history-pick', node)
    }
  }

  /*
    useImperativeHandle(ref, () => {
      return editorRef.current
    }, [editorRef.current])
  */
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

  useZoom(containerRef, executeAction)

  return <Col fw fh stretch ref={contextRootRef} data-focused={state.focused} autoFocus={true}
              tabIndex={0}
              className={'outline-0'}>
    {focusedFileId === workspace.id && <ShortcutListener/>}

    <Header/>

    <Row ovh fh>
      <Toolbar tool={state.currentTool}/>
      <Col fw fh ovh rela flex={1}>
        <FileReceiver>
          <div ref={containerRef}
               editor-container={'true'}
               className={'relative overflow-hidden flex w-full h-full'}
          ></div>
        </FileReceiver>

        <StatusBar setScale={(newScale) => {

        }} ref={worldPointRef}/>

        {
          showContextMenu &&
            <ContextMenu position={contextMenuPosition}
                         onClose={() => {
                           setShowContextMenu(false)
                         }}/>
        }
      </Col>

      <Col fh stretch flex={'none'} w={260} style={{borderLeft: '1px solid #dfdfdf'}}>
        <PropPanel props={state.selectedProps!}/>
        <LayerPanel data={[]}/>
        <HistoryPanel pickHistory={(node) => {
          if (editorRef.current) {
            console.log(9)
            editorRef.current.execute('history-pick', node)
          }
        }}/>
      </Col>
    </Row>
  </Col>
}

export default Workspace