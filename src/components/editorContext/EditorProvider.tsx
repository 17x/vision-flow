import {FC, useContext, useEffect, useReducer, useRef, useState} from 'react'
import Editor from '../../engine/editor/editor.ts'
import ShortcutListener from '../ShortcutListener.tsx'
import {ModulePanel} from '../modulePanel/ModulePanel.tsx'
import {PointRef, StatusBar} from '../statusBar/StatusBar.tsx'
import {HistoryNode} from '../../engine/editor/history/DoublyLinkedList.ts'
import {LayerPanel} from '../layerPanel/LayerPanel.tsx'
import Header from '../header/Header.tsx'
import {HistoryPanel} from '../historyPanel/HistoryPanel.tsx'
import FileContext, {FileType} from '../fileContext/FileContext.tsx'
import EditorContext from './EditorContext.tsx'
import PropPanel from '../propPanel/PropPanel.tsx'
import {ContextMenu} from '../contextMenu/ContextMenu.tsx'
import {EditorEventData, EditorEventType} from '../../engine/editor/actions/type'
import {Print} from '../print/print.tsx'
import {
  ContextMenuHandler,
  HistoryUpdatedHandler, ModuleCopiedHandler,
  ModulesUpdatedHandler,
  SelectionUpdatedHandler,
  ViewportUpdatedHandler, WorldMouseMoveUpdatedHandler,
} from '../../engine/editor/type'
import {EditorReducer, initialEditorState} from './reducer/reducer.ts'

const EditorProvider: FC<{ file: FileType }> = ({file}) => {
  const [state, dispatch] = useReducer(EditorReducer, initialEditorState)
  const editorRef = useRef<Editor>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const worldPointRef = useRef<PointRef | null>(null)
  // const [worldPoint, setWorldPoint] = useState<Point>({x: 0, y: 0})
  const [sortedModules, setSortedModules] = useState<ModuleInstance[]>([])
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0})
  const [showPrint, setShowPrint] = useState(false)
  const contextRootRef = useRef<HTMLDivElement>(null)
  const {currentFileId, startCreateFile, closeFile, saveFileToLocal} = useContext(FileContext)
  const lastSavedHistoryId = useRef(0)
  const currentHistoryId = useRef(0)
  const needSaveLocal = useRef(false)

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

  const executeAction = <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => {
    // console.log(type)

    if (type === 'print') {
      setShowPrint(true)
      return
    }

    if (type === 'newFile') {
      startCreateFile()
      return
    }
    if (type === 'closeFile') {
      closeFile(file.id)
      return
    }

    if (type === 'saveFile') {
      // console.log('state.needSave', state.needSave)
      // console.log(lastSavedHistoryId.current, currentHistoryId.current)
      if (needSaveLocal.current) {
        const editorData: FileType = editorRef.current!.exportToFiles() as FileType

        editorData.name = file.name
        saveFileToLocal(editorData)
        lastSavedHistoryId.current = currentHistoryId.current
        dispatch({type: 'SET_NEED_SAVE', payload: false})
      }
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
    if (containerRef.current && !editorRef.current) {
      editor = new Editor({
        container: containerRef!.current,
        data: {
          id: file.id,
          modules: file.data,
        },
        config: file.config,
        events: {
          // onInitialized: () => { },
          onHistoryUpdated,
          onModulesUpdated,
          onSelectionUpdated,
          onViewportUpdated,
          onWorldMouseMove,
          onContextMenu,
          onModuleCopied,
        },
      })
      editorRef.current = editor
      dispatch({type: 'SET_ID', payload: file.id})
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
    }
  }, [])

  return <EditorContext.Provider value={{
    state,
    // dispatch,
    editorRef,
    applyHistoryNode,
    executeAction,
  }}>
    <div ref={contextRootRef} data-focused={state.focused} autoFocus={true} tabIndex={0}
         className={'outline-0 w-full h-full flex flex-col'}>
      {currentFileId === file.id && <ShortcutListener/>}

      <Header/>

      <main className={'flex flex-row overflow-hidden h-full'}>
        <ModulePanel/>

        <div className={'flex flex-col w-full h-full overflow-hidden relative'}>
          <div ref={containerRef}
               editor-container={'true'}
               className={'relative overflow-hidden flex w-full h-full'}
          ></div>

          <StatusBar ref={worldPointRef}/>

          {
            showContextMenu &&
              <ContextMenu position={contextMenuPosition}
                           onClose={() => {
                             setShowContextMenu(false)
                           }}/>
          }
        </div>
        <div style={{width: 200}} className={'h-full flex-shrink-0 border-l border-gray-200'}>
          <PropPanel props={state.selectedProps!}/>
          <LayerPanel data={sortedModules}/>
          <HistoryPanel/>
        </div>
      </main>

      {showPrint && <Print editorRef={editorRef} onClose={() => {
        setShowPrint(false)
      }}/>}
    </div>

  </EditorContext.Provider>
}

export default EditorProvider