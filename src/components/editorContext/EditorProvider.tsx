import {FC, useContext, useEffect, useRef, useState} from 'react'
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
import {createMockData} from './MOCK.ts'
import {ContextMenu} from '../contextMenu/ContextMenu.tsx'
import {EditorEventData, EditorEventType} from '../../engine/editor/actions/type'
import {Print} from '../print/print.tsx'

const EditorProvider: FC<{ file: FileType }> = ({file}) => {
  const editorRef = useRef<Editor>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [historyArray, setHistoryArray] = useState<HistoryNode[]>([])
  const [worldPoint, setWorldPoint] = useState<Point>({x: 0, y: 0})
  // const worldPoint = useRef<Point>({x: 0, y: 0})
  const [sortedModules, setSortedModules] = useState<ModuleInstance[]>([])
  const [selectedProps, setSelectedProps] = useState<ModuleProps>(null)
  const [selectedModules, setSelectedModules] = useState<UID[]>([])
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [copiedItems, setCopiedItems] = useState<ModuleProps[]>([])
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0})
  const [showPrint, setShowPrint] = useState(false)
  const [saved, setSaved] = useState(false)
  const [historyStatus, setHistoryStatus] = useState<{
    id: HistoryNode['id']
    hasPrev: boolean
    hasNext: boolean
  }>({
    id: 0,
    hasPrev: false,
    hasNext: false,
  })
  // const [history, setHistoryCurrent] = useState<HistoryNode['id']>(0)
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    dx: 0,
    dy: 0,
    status: '',
  })
  const elementRef = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(true)
  const {currentFileId, startCreateFile, saveFileToLocal, setFileInitialized} = useContext(FileContext)

  useEffect(() => {
    let editor: Editor
    console.log(file)
    if (containerRef.current && !file.initialized) {

      editor = new Editor({
        container: containerRef!.current,
        data: {
          id: file.id,
          modules: file.data,
        },
        config: file.config,
        events: {
          onInitialized: () => {
            // createMockData(editor)
          },
          onHistoryUpdated: (historyTree) => {
            setHistoryArray(historyTree!.toArray())

            if (historyTree.current) {
              setHistoryStatus({
                id: historyTree.current.id,
                hasPrev: !!historyTree.current.prev,
                hasNext: !!historyTree.current.next,
              })
              // setHistoryCurrent(historyTree.current.id)
            }
          },
          onModulesUpdated: (moduleMap) => {
            // console.log(Array.from(moduleMap.values()))
            const arr = Array.from(moduleMap.values()).sort((a, b) => a.layer - b.layer)

            setSortedModules(arr)
          },
          onSelectionUpdated: (selected, props) => {
            // console.log('onSelectionUpdated')
            setSelectedModules(Array.from(selected))
            setSelectedProps(props)
            // console.log(selected,props)
          },
          onViewportUpdated: (viewportInfo) => {
            setViewport(viewportInfo)
          },
          onWorldMouseMove: (point) => {
            setWorldPoint(point)
          },
          onContextMenu: (position) => {
            setShowContextMenu(true)
            setContextMenuPosition(position)
          },
          onModuleCopied: (items) => {
            setCopiedItems(items)
          },
        },
      })

      editorRef.current = editor

      setFileInitialized(file.id)
    }

    const element = elementRef.current

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
  }, [file])

  const checkInside = (e) => {
    if (containerRef.current) {
      setFocused(containerRef!.current?.contains(e.target))
    }
  }

  const handleFocus = () => setFocused(true)

  const handleBlur = () => setFocused(false)

  const applyHistoryNode = (node: HistoryNode) => {
    if (editorRef.current) {
      editorRef.current.execute('history-pick', node)
    }
  }

  const executeAction = <K extends EditorEventType>(type: K, data?: EditorEventData<K>) => {
    if (type === 'print') {
      setShowPrint(true)
      return
    }
    if (type === 'newFile') {
      startCreateFile()
      return
    }

    if (type === 'saveFile') {
      const editorData: FileType = editorRef.current!.exportToFiles() as FileType
      editorData.name = file.name
      saveFileToLocal(editorData)
      return
    }

    editorRef.current!.execute(type as K, data)
  }

  return <EditorContext.Provider value={{
    focused,
    historyArray,
    // worldPoint: worldPoint.current,
    selectedModules,
    selectedProps,
    historyStatus,
    copiedItems,
    viewport,
    editorRef,
    applyHistoryNode,
    executeAction,
  }}>
    <div ref={elementRef} data-focused={focused} autoFocus={true} tabIndex={0}
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
          <StatusBar worldPoint={worldPoint}/>
          {
            showContextMenu &&
              <ContextMenu position={contextMenuPosition} onClose={() => {
                setShowContextMenu(false)
              }}/>
          }
        </div>
        <div style={{width: 200}} className={'h-full flex-shrink-0 border-l border-gray-200'}>
          <PropPanel props={selectedProps}/>
          <LayerPanel data={sortedModules}
                      selected={selectedModules}/>
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