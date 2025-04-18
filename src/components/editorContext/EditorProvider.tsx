import {FC, useContext, useEffect, useReducer, useRef, useState} from 'react'
import Editor from '../../engine/editor/editor.ts'
import ShortcutListener from '../ShortcutListener.tsx'
import {ModulePanel} from '../modulePanel/ModulePanel.tsx'
import {StatusBar} from '../statusBar/StatusBar.tsx'
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
  const [worldPoint, setWorldPoint] = useState<Point>({x: 0, y: 0})
  const [sortedModules, setSortedModules] = useState<ModuleInstance[]>([])
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0})
  const [showPrint, setShowPrint] = useState(false)
  const contextRootRef = useRef<HTMLDivElement>(null)
  const [lastSavedHistoryId, setLastSavedHistoryId] = useState(-1)
  const {currentFileId, startCreateFile, saveFileToLocal} = useContext(FileContext)

  const onHistoryUpdated: HistoryUpdatedHandler = (historyTree) => {
    dispatch({type: 'SET_HISTORY_ARRAY', payload: historyTree!.toArray()})

    if (historyTree.current) {
      const newHistoryStatus = {
        id: historyTree.current.id,
        hasPrev: !!historyTree.current.prev,
        hasNext: !!historyTree.current.next,
      }

      dispatch({type: 'SET_HISTORY_STATUS', payload: newHistoryStatus})
      dispatch({type: 'SET_NEED_SAVE', payload: newHistoryStatus.id !== lastSavedHistoryId})
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
    setWorldPoint(point)
  }

  const onContextMenu: ContextMenuHandler = (position) => {
    setShowContextMenu(true)
    setContextMenuPosition(position)
  }

  const onModuleCopied: ModuleCopiedHandler = (items) => {
    // setCopiedItems(items)
    dispatch({type: 'SET_COPIED_ITEMS', payload: items})
  }

  const checkInside = (e) => {
    if (contextRootRef.current) {
      // setFocused(contextRootRef!.current?.contains(e.target))
      // console.log(file.id, contextRootRef!.current?.contains(e.target))
      dispatch({type: 'SET_FOCUSED', payload: contextRootRef!.current?.contains(e.target)})
    }
  }

  const handleFocus = () => dispatch({type: 'SET_FOCUSED', payload: true})
  const handleBlur = () => dispatch({type: 'SET_FOCUSED', payload: false})

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

    if (type === 'saveFile') {
      console.log(state.historyStatus)
      if (state.needSave) {
        const editorData: FileType = editorRef.current!.exportToFiles() as FileType

        editorData.name = file.name
        saveFileToLocal(editorData)
        setLastSavedHistoryId(state.historyStatus.id)
        // setNeedSave(false)
        dispatch({type: 'SET_NEED_SAVE', payload: false})
      }
    }

    editorRef.current!.execute(type as K, data)
  }

  useEffect(() => {
    let editor: Editor
    if (containerRef.current) {
      dispatch({type: 'SET_ID', payload: file.id})
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
    }

    const element = contextRootRef.current

    if (element) {
      window.addEventListener('mousedown', checkInside)
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
      <ShortcutListener/>

      <Header/>

      <main className={'flex flex-row overflow-hidden h-full'}>
        <ModulePanel/>

        <div className={'flex flex-col w-full h-full overflow-hidden relative'}>
          <div ref={containerRef}
               editor-container={'true'}
               className={'relative overflow-hidden flex w-full h-full'}
          ></div>

          <StatusBar worldPoint={worldPoint}/>

          {
            showContextMenu &&
              <ContextMenu position={contextMenuPosition} onClose={() => {
                setShowContextMenu(false)
              }}/>
          }
        </div>
        <div style={{width: 200}} className={'h-full flex-shrink-0 border-l border-gray-200'}>
          <PropPanel props={state.selectedProps!}/>
          <LayerPanel data={sortedModules} selected={state.selectedModules}/>
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