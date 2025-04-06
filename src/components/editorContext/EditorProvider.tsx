import {FC, useEffect, useRef, useState} from 'react'
import Editor from "../../engine/editor/editor.ts"
import ShortcutListener from "../ShortcutListener.tsx"
import {ModulePanel} from "../modulePanel/ModulePanel.tsx"
import {StatusBar} from "../statusBar/StatusBar.tsx"
import uid from "../../utilities/Uid.ts"
import {HistoryNode} from "../../engine/editor/history/DoublyLinkedList.ts"
import {LayerPanel} from "../layerPanel/LayerPanel.tsx"
import {
  ActionCode,
  HistoryUpdatedHandler,
  ModulesUpdatedHandler,
  SelectionUpdatedHandler
} from "../../engine/editor/type"
import Header from "../header/Header.tsx"
import {HistoryPanel} from "../historyPanel/HistoryPanel.tsx"
import {FileType} from "../fileContext/FileContext.tsx"
import EditorContext from './EditorContext.tsx'
import PropPanel from "../propPanel/PropPanel.tsx"

const EditorProvider: FC<{ file: FileType }> = ({file}) => {
  const editorRef = useRef<Editor>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [historyArray, setHistoryArray] = useState<HistoryNode[]>([])
  const [sortedModules, setSortedModules] = useState<ModuleType[]>([])
  const [selectedProps, setSelectedProps] = useState<ModuleProps>(null)
  const [selectedModules, setSelectedModules] = useState<UID[]>([])
  const [historyCurrent, setHistoryCurrent] = useState<HistoryNode>({} as HistoryNode)
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
          onHistoryUpdated,
          onModulesUpdated,
          onSelectionUpdated
        }
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

  const onSelectionUpdated: SelectionUpdatedHandler = (selected, props) => {
    setSelectedModules(Array.from(selected))
    setSelectedProps(props)
  }

  const onHistoryUpdated: HistoryUpdatedHandler = (historyTree) => {
    setHistoryArray(historyTree!.toArray())

    if (historyTree.current) {
      setHistoryCurrent(historyTree.current)
    }
  }

  const onModulesUpdated: ModulesUpdatedHandler = (moduleMap) => {
    // console.log(Array.from(moduleMap.values()))
    const arr = Array.from(moduleMap.values()).sort((a, b) => a.layer - b.layer)

    setSortedModules(arr)
  }

  const applyHistoryNode = (node: HistoryNode) => {
    if (editorRef.current) {
      editorRef.current.history.moveCurrentById(node)
    }
  }

  const executeAction = (code: ActionCode, data: unknown = null) => {
    editorRef.current!.execute(code, data)
  }

  return (
    <EditorContext.Provider value={{
      focused,
      historyArray,
      selectedModules,
      selectedProps,
      historyCurrent,
      editorRef,
      applyHistoryNode,
      executeAction
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
            <StatusBar/>
          </div>

          <div className={'w-[40%] h-full border-l border-gray-200'}>
            <PropPanel/>
            <LayerPanel data={sortedModules}
                        selected={selectedModules}
                        handleSelectModule={id => {
                          executeAction('select', new Set([id]))
                        }}/>
            <HistoryPanel/>
          </div>
        </main>

      </div>
    </EditorContext.Provider>
  )
}

const createMockData = (editor: Editor) => {
  const baseX = 100
  const baseY = 100
  const baseRectData: Omit<ShapeProps, 'id' | 'layer'> = {
    type: "rectangle",
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    enableLine: true,
    lineColor: "#000000",
    lineWidth: 1,
    enableFill: true,
    fillColor: "#fff",
    opacity: 100,
    shadow: false,
    radius: 0,
    rotation: 0
  }
  const MOCK_ELE_LEN = 1000
  // const MOCK_ELE_LEN = 20000
  const shiftSpeed = 30
  // const MOCK_ELE_LEN = 2
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRandomHexColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`
  }

  editor.batchAdd(
    editor.batchCreate(
      Array.from({length: MOCK_ELE_LEN}).map((_, i) => {
        return {
          ...baseRectData,
          // fillColor: getRandomHexColor(),
          fillColor: '#ed1c24',
          x: baseX + (i * shiftSpeed),
          y: baseY + (i * shiftSpeed),
          layer: i + 1,
          rotation: i + 10,
        }
      })
    ),
    "addModules"
  )
  /*
    const c1data: Omit<ConnectorProps, 'id' | 'layer'> = {
      type: "connector",
      start: r1.id,
      end: r2.id,
      lineColor: "000",
    } */
}

export default EditorProvider