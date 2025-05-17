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
import WorkspaceProvider from '../../contexts/workspaceContext/WorkspaceProvider.tsx'
import {ReactNode, RefObject, useRef} from 'react'
import useEditor from '../../hooks/useEditor.tsx'
import useZoom from '../../hooks/useZoom.tsx'
import {VisionWorkspace} from '../../contexts/appContext/AppContext.tsx'

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
  const contextRootRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const worldPointRef = useRef<PointRef | null>(null)
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

  useEditor(containerRef, workspace, page)
  useZoom(containerRef)

  return <WorkspaceProvider>
    <Col fw fh stretch ref={contextRootRef} data-focused={state.focused} autoFocus={true}
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

          <StatusBar ref={worldPointRef}/>

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
          <HistoryPanel/>
        </Col>
      </Row>
    </Col>
  </WorkspaceProvider>
}

export default Workspace