import {FC, RefObject, useContext, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState} from 'react'
import {Editor} from '@lite-u/editor'
import ShortcutListener from '../../components/ShortcutListener.tsx'
import {PointRef, StatusBar} from '../../components/statusBar/StatusBar.tsx'
import {HistoryNode, VisionEventData, VisionEventType} from '@lite-u/editor/types'
import {LayerPanel} from '../../components/layerPanel/LayerPanel.tsx'
import Header from '../../components/header/Header.tsx'
import {HistoryPanel} from '../../components/historyPanel/HistoryPanel.tsx'
import FileContext, {VisionWorkspace} from '../fileContext/FileContext.tsx'
import EditorContext from './EditorContext.tsx'
import PropPanel from '../../components/propPanel/PropPanel.tsx'
import {ContextMenu} from '../../components/contextMenu/ContextMenu.tsx'
import {EditorReducer, initialEditorState} from './reducer/reducer.ts'
import {Col, Row, useNotification} from '@lite-u/ui'
import {useTranslation} from 'react-i18next'
import Toolbar from '../../components/toolbar/Toolbar.tsx'
import useZoom from '../../hooks/useZoom.tsx'
import useEditor from '../../hooks/useEditor.tsx'
import FileReceiver from '../../components/fileReceiver.tsx'

const EditorProvider: FC<{
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
  const {focusedFileId, startCreateFile, closeFile, saveFileToLocal} = useContext(FileContext)
  const [state, dispatch] = useReducer(EditorReducer, initialEditorState)
  const editorRef = useRef<Editor>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const worldPointRef = useRef<PointRef | null>(null)
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const contextRootRef = useRef<HTMLDivElement>(null)
  const {add} = useNotification()
  const {t} = useTranslation()
  const applyHistoryNode = (node: HistoryNode) => {
    if (editorRef.current) {
      editorRef.current.execute('history-pick', node)
    }
  }

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
    applyHistoryNode,
    executeAction,
  }), [state, applyHistoryNode, executeAction])
  /*
    const handleZoom = (zoomIn: boolean, p: { x: number, y: number }) => {
      const curr = state.worldScale
      let nextScale = null
      let filtered = ZOOM_LEVELS.filter(z => typeof z.value === 'number')

      if (zoomIn) {
        nextScale = filtered.reverse().find(z => z.value > curr)
      } else {
        nextScale = filtered.find(z => z.value < curr)
      }

      if (nextScale) {
        executeAction('world-zoom', {
          zoomTo: true,
          zoomFactor: nextScale.value,
          physicalPoint: p,
        })
      }
    }*/
  useImperativeHandle(ref, () => {
    return editorRef.current
  }, [editorRef.current])

  useEditor(containerRef, workspace, page)
  useZoom(containerRef)

  useEffect(() => {
    console.log(containerRef)
  }, [])

  return <EditorContext.Provider value={contextValue}>
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

  </EditorContext.Provider>
}

export default EditorProvider