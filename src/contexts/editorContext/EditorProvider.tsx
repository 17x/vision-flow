import {FC, RefObject, useContext, useEffect, useImperativeHandle, useReducer, useRef, useState} from 'react'
import {Editor} from '@lite-u/editor'
import ShortcutListener from '../../components/ShortcutListener.tsx'
import {PointRef, StatusBar} from '../../components/statusBar/StatusBar.tsx'
import {HistoryNode} from '@lite-u/editor/DoublyLinkedList.ts'
import {LayerPanel} from '../../components/layerPanel/LayerPanel.tsx'
import Header from '../../components/header/Header.tsx'
import {HistoryPanel} from '../../components/historyPanel/HistoryPanel.tsx'
import FileContext, {VisionWorkspace} from '../fileContext/FileContext.tsx'
import EditorContext from './EditorContext.tsx'
import PropPanel from '../../components/propPanel/PropPanel.tsx'
import {ContextMenu} from '../../components/contextMenu/ContextMenu.tsx'
import {VisionEventData, VisionEventType} from '@lite-u/editor/types'
import {EditorReducer, initialEditorState} from './reducer/reducer.ts'
import {useUI} from '../UIContext/UIContext.tsx'
import {Col, Con, Drop, Row, useNotification} from '@lite-u/ui'
import readImageHelper from './readImageHelper.ts'
import {useTranslation} from 'react-i18next'
import Toolbar from '../../components/toolbar/Toolbar.tsx'
import Zoom from '../../lib/zoom/zoom.ts'
import useZoom from '../../hooks/useZoom.tsx'
import ZOOM_LEVELS from '../../constants/zoomLevels.ts'

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
  const [sortedModules, setSortedModules] = useState<ElementInstance[]>([])
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
  }

  useZoom({
    ref: containerRef,
    onZoom: handleZoom,
    onScroll: (x, y) => {
      executeAction('world-shift', {x, y})
    },
  })

  useImperativeHandle(ref, () => {
    return editorRef.current
  }, [editorRef.current])

  const checkInside = (e: MouseEvent) => {
    if (contextRootRef.current) {
      dispatch({type: 'SET_FOCUSED', payload: contextRootRef!.current?.contains(e.target as Node)})
    }
  }

  const handleFocus = () => {
    dispatch({type: 'SET_FOCUSED', payload: true})
  }

  const handleBlur = () => {
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
    let editor: InstanceType<Editor>

    if (containerRef.current && !editorRef.current) {

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
          onZoomed: (scale) => {
            dispatch({type: 'SET_WORLD_SCALE', payload: scale})
          },
          onHistoryUpdated: (historyTree) => {
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
          },
          onModulesUpdated: (moduleMap) => {
            const arr = Array.from(moduleMap.values()).sort((a, b) => a.layer - b.layer)

            setSortedModules(arr)
          },
          onSelectionUpdated: (selected, props) => {
            dispatch({type: 'SET_SELECTED_MODULES', payload: Array.from(selected)})
            dispatch({type: 'SET_SELECTED_PROPS', payload: props})
          },
          onViewportUpdated: (viewportInfo) => {
            dispatch({type: 'SET_VIEWPORT', payload: viewportInfo})
          },
          onWorldMouseMove: (point) => {
            // dispatch({type: 'SET_WORLD_POINT', payload: point})
            // worldPoint.current = point
            if (worldPointRef.current) {
              worldPointRef.current.set(point)
            }
          },
          onContextMenu: (position) => {
            setShowContextMenu(true)
            setContextMenuPosition(position)
          },
          onModuleCopied: (items) => {
            dispatch({type: 'SET_COPIED_ITEMS', payload: items})
          },
          onSwitchTool: (toolName) => {
            dispatch({type: 'SET_CURRENT_TOOL', payload: toolName})
          },
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
        window.removeEventListener('mouseup', checkInside)
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
    <Col fw fh stretch ref={contextRootRef} data-focused={state.focused} autoFocus={true}
         tabIndex={0}
         className={'outline-0'}>
      {focusedFileId === workspace.id && <ShortcutListener/>}

      <Header/>

      <Row ovh fh>
        <Toolbar tool={state.currentTool}/>
        <Col fw fh ovh rela flex={1}>
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
                    executeAction('drop-image', {position: {x: e.clientX, y: e.clientY}, assets: [newAsset]})
                  }).catch(() => {
                    add(t('misc.imageResolveFailed'), 'info')
                  })
                }}>
            <div ref={containerRef}
                 editor-container={'true'}
                 className={'relative overflow-hidden flex w-full h-full'}
            ></div>

            {
              showDropNotice && <Con fw fh abs t={0} l={0} borderColor={dropNoticeColor} style={{
                border: '5px solid',
                pointerEvents: 'none',
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
        </Col>
        <Col fh stretch flex={'none'} w={260} style={{borderLeft: '1px solid #dfdfdf'}}>
          <PropPanel props={state.selectedProps!}/>
          <LayerPanel data={sortedModules}/>
          <HistoryPanel/>
        </Col>
      </Row>
    </Col>

  </EditorContext.Provider>
}

export default EditorProvider