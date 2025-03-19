import React, {createContext, useEffect, useRef, useState} from 'react';
import Editor, {basicEditorAreaSize} from "../engine/editor";
import ShortcutListener from "./ShortcutListener.tsx";
import Header from "./header/Header.tsx";
import {ModulePanel} from "./modulePanel/ModulePanel.tsx";
import {PropertyPanel} from "./PropertyPanel.tsx";
import {StatusBar} from "./StatusBar/StatusBar.tsx";
import uid from "../utilities/Uid.ts";
import {HistoryPanel} from "./historyPanel/historyPanel.tsx";
import {OnHistoryUpdated} from "../engine/editor/events";
import {HistoryNode} from "../engine/editor/history/HistoryDoublyLinkedList.ts";

interface EditorContextType {
  historyArray: HistoryNode[]
  historyCurrent: HistoryNode
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void

}

export const EditorContext = createContext<EditorContextType>({
  historyArray: [] as HistoryNode[],
  historyCurrent: {} as HistoryNode,
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {

  }
});

export const EditorProvider = () => {
  const editorRef = useRef<Editor>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const [historyArray, setHistoryArray] = useState<HistoryNode[]>([])
  const [historyCurrent, setHistoryCurrent] = useState<HistoryNode>({} as HistoryNode)

  useEffect(() => {
    let editor: Editor;

    if (divRef.current) {
      const container = divRef!.current
      console.log(9)
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
    console.log(historyTree!.toArray())

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

  return (
    <EditorContext.Provider value={{
      historyArray,
      historyCurrent,
      editorRef,
      applyHistoryNode,
    }}>
      <div className={'w-full h-full flex flex-col'}>
        <ShortcutListener/>
        <Header/>

        <main className={'flex flex-row overflow-hidden'}>
          <ModulePanel/>

          <div className={'flex flex-col w-full h-full overflow-hidden'}>
            <div ref={divRef}></div>
            <StatusBar/>
          </div>
          {/*<EditorComponent/>*/}

          <div className={'w-[30%] h-full border-l border-gray-200'}>
            <HistoryPanel/>
            <PropertyPanel/>
          </div>
        </main>

      </div>
    </EditorContext.Provider>
  );
};

const createMockData = (editor: Editor) => {

  const dataBase: Omit<ModuleProps, 'id'> = {
    type: "rectangle",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    lineColor: "000",
    fillColor: "000000",
    opacity: 100,
    shadow: false,
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const data: ModuleProps[] = Array.from({length: 1}, (_, index) => {
    return {
      ...dataBase,
      x: (index + 1) * 10,
      y: (index + 1) * 20,
    }
  })

  const modules = editor.batchCreate(data)

  editor.batchAdd(
    modules,
    "add-modules"
  )

}