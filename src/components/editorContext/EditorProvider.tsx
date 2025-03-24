import {useContext, useEffect, useRef, useState} from 'react';
import Editor, {basicEditorAreaSize} from "../../engine/editor";
import ShortcutListener from "../ShortcutListener.tsx";
import {ModulePanel} from "../modulePanel/ModulePanel.tsx";
import {PropertyPanel} from "../PropertyPanel.tsx";
import {StatusBar} from "../statusBar/StatusBar.tsx";
import uid from "../../utilities/Uid.ts";
import {OnHistoryUpdated} from "../../engine/editor/events";
import {HistoryNode} from "../../engine/editor/history/HistoryDoublyLinkedList.ts";
import {LayerPanel} from "../layerPanel/LayerPanel.tsx";
import {ActionCode} from "../../engine/editor/editor";
import Header from "../header/Header.tsx";
import {HistoryPanel} from "../historyPanel/HistoryPanel.tsx";
import FileContext from "../fileContext/FileContext.tsx";
import EditorContext from './EditorContext.tsx';

const EditorProvider = () => {
  const editorRef = useRef<Editor>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const [historyArray, setHistoryArray] = useState<HistoryNode[]>([])
  const [historyCurrent, setHistoryCurrent] = useState<HistoryNode>({} as HistoryNode)
  const {files} = useContext(FileContext)
  const editorsRef = useRef<Map<UID, Editor>>(new Map());

  useEffect(() => {
    const editors = editorsRef.current
    let editor: Editor;
    console.log(editors)
    console.log(editorsRef.current)
    console.log(files)

    if (divRef.current) {
      const container = divRef!.current

      const newUID = uid();

      editor = new Editor({
        container,
        data: {
          id: newUID,
          size: basicEditorAreaSize,
          modules: [],
        },
        events: {
          onHistoryUpdated
        }
      });

      createMockData(editor)
      editorRef.current = editor
    }
  }, [])

  const onHistoryUpdated: OnHistoryUpdated = (historyTree) => {

    setHistoryArray(historyTree!.toArray())

    if (historyTree.current) {
      setHistoryCurrent(historyTree.current)
    }
  }

  const applyHistoryNode = (node: HistoryNode) => {
    if (editorRef.current) {
      editorRef.current.history.setNode(node)
    }
  }

  const executeAction = (code: ActionCode) => {
    editorRef.current!.execute(code)
  }

  return (
    <EditorContext.Provider value={{
      historyArray,
      historyCurrent,
      editorRef,
      applyHistoryNode,
      executeAction
    }}>
      <div className={'w-full h-full flex flex-col'}>
        <ShortcutListener/>

        <Header/>

        <main className={'flex flex-row overflow-hidden h-full'}>
          <ModulePanel/>

          <div className={'flex flex-col w-full h-full overflow-hidden'}>
            <div ref={divRef} className={'relative overflow-hidden flex w-full h-full'} editor-container={'true'}></div>
            <StatusBar/>
          </div>

          <div className={'w-[40%] h-full border-l border-gray-200'}>
            <LayerPanel/>
            <HistoryPanel/>
            <PropertyPanel/>
          </div>
        </main>

      </div>
    </EditorContext.Provider>
  );
};

const createMockData = (editor: Editor) => {
  const baseX = 50
  const baseY = 50
  const baseRectData: Omit<ShapeProps, 'id' | 'layer'> = {
    type: "rectangle",
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    lineColor: "000",
    fillColor: "000000",
    opacity: 100,
    shadow: false,
  }
  editor.batchAdd(
    editor.batchCreate(
      Array.from({length: 5000}).map((_, i) => {
        return {
          ...baseRectData,
          x: baseX + (i * 10),
          y: baseY + (i * 10),
        }
      })
    ),
    "add-modules"
  )
  /*
    const c1data: Omit<ConnectorProps, 'id' | 'layer'> = {
      type: "connector",
      start: r1.id,
      end: r2.id,
      lineColor: "000",
    } */
}

export default EditorProvider;