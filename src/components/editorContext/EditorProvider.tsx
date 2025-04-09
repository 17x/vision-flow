import {FC, useEffect, useRef, useState} from 'react'
import Editor from '../../engine/editor/editor.ts'
import ShortcutListener from '../ShortcutListener.tsx'
import {ModulePanel} from '../modulePanel/ModulePanel.tsx'
import {StatusBar} from '../statusBar/StatusBar.tsx'
import uid from '../../utilities/Uid.ts'
import {HistoryNode} from '../../engine/editor/history/DoublyLinkedList.ts'
import {LayerPanel} from '../layerPanel/LayerPanel.tsx'
import {
  ModuleOperationType,
} from '../../engine/editor/type'
import Header from '../header/Header.tsx'
import {HistoryPanel} from '../historyPanel/HistoryPanel.tsx'
import {FileType} from '../fileContext/FileContext.tsx'
import EditorContext from './EditorContext.tsx'
import PropPanel from '../propPanel/PropPanel.tsx'
import {createMockData} from './MOCK.ts'

const EditorProvider: FC<{ file: FileType }> = ({file}) => {
  const editorRef = useRef<Editor>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [historyArray, setHistoryArray] = useState<HistoryNode[]>([])
  const [worldPoint, setWorldPoint] = useState<Point>({x: 0, y: 0})
  const [sortedModules, setSortedModules] = useState<ModuleType[]>([])
  const [selectedProps, setSelectedProps] = useState<ModuleProps>(null)
  const [selectedModules, setSelectedModules] = useState<UID[]>([])
  const [historyCurrent, setHistoryCurrent] = useState<HistoryNode['id']>(0)
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

  useEffect(() => {
    let editor: Editor

    if (containerRef.current) {
      const newUID = uid()

      editor = new Editor({
        container: containerRef!.current,
        data: {
          id: newUID,
          // size: basicEditorAreaSize,
          modules: [],
        },
        events: {
          onHistoryUpdated: (historyTree) => {
            setHistoryArray(historyTree!.toArray())

            if (historyTree.current) {
              setHistoryCurrent(historyTree.current.id)
            }
          },
          onModulesUpdated: (moduleMap) => {
            // console.log(Array.from(moduleMap.values()))
            const arr = Array.from(moduleMap.values()).sort((a, b) => a.layer - b.layer)

            setSortedModules(arr)
          },
          onSelectionUpdated: (selected, props) => {
            setSelectedModules(Array.from(selected))
            setSelectedProps(props)
          },
          onViewportUpdated: (viewportInfo) => {
            setViewport(viewportInfo)
          },
          onWorldMouseMove: (point) => {
            setWorldPoint(point)
          },
          onContextMenu: (idSet, position) => {
            console.log(idSet, position)
          },
        },
      })

      createMockData(editor)
      editorRef.current = editor
    }

    const element = elementRef.current
    if (element) {
      element.addEventListener('focus', handleFocus)
      element.addEventListener('blur', handleBlur)
    }

    return () => {
      if (element) {
        element.removeEventListener('focus', handleFocus)
        element.removeEventListener('blur', handleBlur)
      }

      if (editor) {
        editor.destroy()
      }
    }
  }, [file])

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)

  const applyHistoryNode = (node: HistoryNode) => {
    if (editorRef.current) {
      editorRef.current.execute('history-pick', node)
    }
  }

  const executeAction = (code: ModuleOperationType, data: unknown = null) => {
    editorRef.current!.execute(code, data)
  }

  return (
    <EditorContext.Provider value={{
      focused,
      historyArray,
      selectedModules,
      selectedProps,
      historyCurrent,
      viewport,
      editorRef,
      applyHistoryNode,
      executeAction,
    }}>
      <div ref={elementRef} data-focused={focused} autoFocus={true} tabIndex={0}
           className={'outline-0 w-full h-full flex flex-col'}>
        <ShortcutListener/>

        <Header/>

        <main className={'flex flex-row overflow-hidden h-full'}>
          <ModulePanel/>

          <div className={'flex flex-col w-full h-full overflow-hidden'}>
            <div ref={containerRef}
                 editor-container={'true'}
                 className={'relative overflow-hidden flex w-full h-full'}
            ></div>
            <StatusBar worldPoint={worldPoint}/>

          </div>

          <div style={{width: 200}} className={'h-full flex-shrink-0 border-l border-gray-200'}>
            <PropPanel/>
            <LayerPanel data={sortedModules}
                        selected={selectedModules}
                        handleSelectModule={id => {
                          executeAction('selection-modify', new Set([id]))
                        }}/>
            <HistoryPanel/>
          </div>
        </main>

      </div>
    </EditorContext.Provider>
  )
}

export default EditorProvider