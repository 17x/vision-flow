import {FC, RefObject, useContext, useEffect, useImperativeHandle, useReducer, useRef, useState} from 'react'
import {Editor} from '@editor'
import ShortcutListener from '../../components/ShortcutListener.tsx'
import {PointRef, StatusBar} from '../../components/statusBar/StatusBar.tsx'
import {HistoryNode} from '@editor/engine/history/DoublyLinkedList.ts'
import {LayerPanel} from '../../components/layerPanel/LayerPanel.tsx'
import Header from '../../components/header/Header.tsx'
import {HistoryPanel} from '../../components/historyPanel/HistoryPanel.tsx'
import FileContext, {VisionWorkspace} from '../fileContext/FileContext.tsx'
import EditorContext from './EditorContext.tsx'
import PropPanel from '../../components/propPanel/PropPanel.tsx'
import {ContextMenu} from '../../components/contextMenu/ContextMenu.tsx'
import {VisionEventData, VisionEventType} from '@editor/engine/actions/type'
import {
  ContextMenuHandler,
  EditorConfig,
  HistoryUpdatedHandler,
  ModuleCopiedHandler,
  ModulesUpdatedHandler,
  SelectionUpdatedHandler,
  SwitchToolHandler,
  ViewportUpdatedHandler,
  WorldMouseMoveUpdatedHandler,
} from '@editor/engine/type'
import {EditorReducer, initialEditorState} from './reducer/reducer.ts'
import {useUI} from '../UIContext/UIContext.tsx'
import {Con, Drop, Flex, useNotification} from '@lite-u/ui'
import readImageHelper from './readImageHelper.ts'
import {useTranslation} from 'react-i18next'
import Toolbar from '../../components/toolbar/Toolbar.tsx'
import Zoom from '../../lib/zoom/zoom.ts'

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
  const [state, dispatch] = useReducer(EditorReducer, initialEditorState)
  const editorRef = useRef<Editor>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const worldPointRef = useRef<PointRef | null>(null)
  // const [worldPoint, setWorldPoint] = useState<Point>({x: 0, y: 0})
  const [sortedModules, setSortedModules] = useState<ModuleInstance[]>([])
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0})
  const contextRootRef = useRef<HTMLDivElement>(null)
  const {focusedFileId, startCreateFile, closeFile, saveFileToLocal} = useContext(FileContext)
  const lastSavedHistoryId = useRef(0)
  const currentHistoryId = useRef(0)
  const needSaveLocal = useRef(false)
  const [showDropNotice, setShowDropNotice] = useState(false)
  const [dropNoticeColor, setDropNoticeColor] = useState('green')
  const {dpr} = useUI()
  const {add} = useNotification()
  const {t} = useTranslation()
  const zoomPluginRef = useRef<Zoom | null>(null)
  useImperativeHandle(ref, () => {
    return editorRef.current
  }, [editorRef.current])

  const onHistoryUpdated: HistoryUpdatedHandler = (historyTree) => {
    dispatch({type: 'SET_HISTORY_ARRAY', payload: historyTree!.toArray()})

    if (historyTree.current) {
      const newHistoryStatus = {
        id: historyTree.current.id,
        hasPrev: !!historyTree.current.prev,
        hasNext: !!historyTree.current.next,
      }
      const newNeedSaveValue = newHistoryStatus.id !== lastSavedHistoryId.current
      // console.log(state.historyStatus)

      // console.log(state.needSave)
      // console.log(newHistoryStatus.id, lastSavedHistoryId.current)
      // console.log(newHistoryStatus.id !== lastSavedHistoryId.current)

      currentHistoryId.current = newHistoryStatus.id
      dispatch({type: 'SET_HISTORY_STATUS', payload: newHistoryStatus})
      dispatch({type: 'SET_NEED_SAVE', payload: newNeedSaveValue})
      needSaveLocal.current = newNeedSaveValue
    }
  }
  // console.log(state)
  const onModulesUpdated: ModulesUpdatedHandler = (moduleMap) => {
    const arr = Array.from(moduleMap.values()).sort((a, b) => a.layer - b.layer)

    setSortedModules(arr)
  }

  const onSelectionUpdated: SelectionUpdatedHandler = (selected, props) => {
    dispatch({type: 'SET_SELECTED_MODULES', payload: Array.from(selected)})
    dispatch({type: 'SET_SELECTED_PROPS', payload: props})
  }

  const onViewportUpdated: ViewportUpdatedHandler = (viewportInfo) => {
    dispatch({type: 'SET_VIEWPORT', payload: viewportInfo})
  }

  const onWorldMouseMove: WorldMouseMoveUpdatedHandler = (point) => {
    // dispatch({type: 'SET_WORLD_POINT', payload: point})
    // worldPoint.current = point
    if (worldPointRef.current) {
      worldPointRef.current.set(point)
    }
  }

  const onContextMenu: ContextMenuHandler = (position) => {
    setShowContextMenu(true)
    setContextMenuPosition(position)
  }

  const onModuleCopied: ModuleCopiedHandler = (items) => {
    dispatch({type: 'SET_COPIED_ITEMS', payload: items})
  }

  const checkInside = (e: MouseEvent) => {
    if (contextRootRef.current) {
      dispatch({type: 'SET_FOCUSED', payload: contextRootRef!.current?.contains(e.target as Node)})
    }
  }

  const onSwitchTool: SwitchToolHandler = (toolName) => {
    dispatch({type: 'SET_CURRENT_TOOL', payload: toolName})
  }

  const handleFocus = () => {
    console.log('focus')
    dispatch({type: 'SET_FOCUSED', payload: true})
  }
  const handleBlur = () => {
    console.log('blurred')
    dispatch({type: 'SET_FOCUSED', payload: false})
  }

  const applyHistoryNode = (node: HistoryNode) => {
    if (editorRef.current) {
      editorRef.current.execute('history-pick', node)
    }
  }

  const executeAction = <K extends VisionEventType>(type: K, data?: VisionEventData<K>) => {
    // console.log(type)

    if (type === 'newFile') {
      startCreateFile()
      return
    }

    if (type === 'closeFile') {
      closeFile(data.id)
      return
    }

    if (type === 'saveFile') {
      // console.log('state.needSave', state.needSave)
      // console.log(lastSavedHistoryId.current, currentHistoryId.current)
      /*   if (needSaveLocal.current) {
           const editorData = editorRef.current!.export()

           console.log(editorData)
           editorData.name = data.name
           saveFileToLocal(editorData)
           lastSavedHistoryId.current = currentHistoryId.current
           dispatch({type: 'SET_NEED_SAVE', payload: false})
         }*/

    }

    editorRef.current!.execute(type as K, data)
  }

  useEffect(() => {
    let editor: Editor
    /*    window.onbeforeunload = (event)=>{
          // alert(999)
          event.preventDefault();
          // return false;
        }*/
    // console.log(workspace)
    if (containerRef.current && !editorRef.current) {
      zoomPluginRef.current = new Zoom({
        dom: containerRef.current,
        onZoom: (zoomIn) => {
          console.log('zoomIn:', zoomIn)
        },
        onScroll: (x, y) => {
          executeAction('world-shift', {x, y})
        },
      })
      editor = new Editor({
        container: containerRef!.current,
        elements: workspace.elements,
        assets: workspace.assets,
        config: {
          dpr,
          page,
        },
        events: {
          onInitialized: () => {
            editor.execute('switch-tool', state.currentTool)
          },
          onHistoryUpdated,
          onModulesUpdated,
          onSelectionUpdated,
          onViewportUpdated,
          onWorldMouseMove,
          onContextMenu,
          onModuleCopied,
          onSwitchTool,
        },
      })
      editorRef.current = editor
      dispatch({type: 'SET_ID', payload: workspace.id})

    }
    const element = contextRootRef.current

    if (element) {
      window.addEventListener('mouseup', checkInside)
      element.addEventListener('focus', handleFocus)
      element.addEventListener('blur', handleBlur)
    }

    return () => {
      if (element) {
        window.removeEventListener('mousedown', checkInside)
        element.removeEventListener('focus', handleFocus)
        element.removeEventListener('blur', handleBlur)
      }

      if (editor) {
        editor.destroy()
      }
      if (zoomPluginRef.current) {
        zoomPluginRef.current.destroy()
      }
    }
  }, [])

  return <EditorContext.Provider value={{
    state,
    // dispatch,
    editorRef,
    applyHistoryNode,
    executeAction,
  }}>
    <Flex col fw fh alignItems={'stretch'} ref={contextRootRef} data-focused={state.focused} autoFocus={true}
          tabIndex={0}
          className={'outline-0'}>
      {focusedFileId === workspace.id && <ShortcutListener/>}

      <Header/>

      <main className={'flex flex-row overflow-hidden h-full'}>
        {/*<ModulePanel/>*/}
        <Toolbar tool={state.currentTool}/>
        <div className={'flex flex-col w-full h-full overflow-hidden relative'}>
          <Drop accepts={['image/*']}
                style={{position: 'relative'}}
                onDragIsOver={(v) => {
                  setDropNoticeColor(v ? 'green' : 'red')
                  setShowDropNotice(true)
                }}
                onDragIsLeave={() => {
                  setShowDropNotice(false)
                }}
                onDrop={(e) => {
                  setShowDropNotice(false)

                  readImageHelper(e.dataTransfer.files[0]).then(newAsset => {
                    console.log(newAsset)
                    executeAction('drop-image', {position: {x: e.clientX, y: e.clientY}, assets: [newAsset]})
                  }).catch(() => {
                    add(t('misc.imageResolveFailed'), 'info')
                  })
                  /*      // setReadingFile(true)
                        readFileHelper(e.dataTransfer.files[0]).then(newFile => {
                          // openFile(newFile)
                        }).catch(() => {
                          // add(t('misc.fileResolveFailed'), 'info')
                        })*/
                }}>
            <div ref={containerRef}
                 editor-container={'true'}
                 className={'relative overflow-hidden flex w-full h-full'}
            ></div>

            {
              showDropNotice && <Con fw fh style={{
                border: '5px solid',
                borderColor: dropNoticeColor,
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
              }}></Con>
            }
          </Drop>

          <StatusBar ref={worldPointRef}/>

          {
            showContextMenu &&
              <ContextMenu position={contextMenuPosition}
                           onClose={() => {
                             setShowContextMenu(false)
                           }}/>
          }
        </div>
        <Flex col w={260} alignItems={'stretch'} className={'h-full border-l border-gray-200'}>
          <PropPanel props={state.selectedProps!}/>
          <LayerPanel data={sortedModules}/>
          <HistoryPanel/>
        </Flex>
      </main>
    </Flex>

  </EditorContext.Provider>
}

export default EditorProvider