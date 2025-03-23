import React, {createContext, useEffect, useRef, useState} from 'react';
import Editor, {basicEditorAreaSize} from "../engine/editor";
import ShortcutListener from "./ShortcutListener.tsx";
// import Header from "./header/Header.tsx";
import {ModulePanel} from "./modulePanel/ModulePanel.tsx";
import {PropertyPanel} from "./PropertyPanel.tsx";
import {StatusBar} from "./StatusBar/StatusBar.tsx";
import uid from "../utilities/Uid.ts";
import {HistoryPanel} from "./historyPanel/historyPanel.tsx";
import {OnHistoryUpdated} from "../engine/editor/events";
import {HistoryNode} from "../engine/editor/history/HistoryDoublyLinkedList.ts";
import {LayerPanel} from "./layerPanel/LayerPanel.tsx";
import {ActionCode} from "../engine/editor/editor";
import Connector, {ConnectorProps} from "../engine/core/modules/connectors/connector.ts";
import Header from "./header/Header.tsx";
import CreateFile from "./createFile.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";

interface EditorContextType {
  historyArray: HistoryNode[]
  historyCurrent: HistoryNode
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  executeAction: (code: ActionCode) => void
}

export const EditorContext = createContext<EditorContextType>({
  historyArray: [] as HistoryNode[],
  historyCurrent: {} as HistoryNode,
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {

  },
  executeAction: () => {

  }
});

export const EditorProvider = () => {
  const editorRef = useRef<Editor>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const [historyArray, setHistoryArray] = useState<HistoryNode[]>([])
  const [historyCurrent, setHistoryCurrent] = useState<HistoryNode>({} as HistoryNode)
  const {files, creating} = useSelector((state: RootState) => state.files);
  const fileLen = Object.values(files).length
  const showCreateFile = fileLen === 0 || creating

  useEffect(() => {
    let editor: Editor;

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
    // console.log(historyTree!.toArray())

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

        <main className={'flex flex-row overflow-hidden'}>
          <ModulePanel/>

          <div className={'flex flex-col w-full h-full overflow-hidden'}>
            <div ref={divRef}></div>
            <StatusBar/>
          </div>
          {/*<EditorComponent/>*/}

          <div className={'w-[30%] h-full border-l border-gray-200'}>
            <LayerPanel/>
            <HistoryPanel/>
            <PropertyPanel/>
          </div>
        </main>

      </div>
      {showCreateFile && <CreateFile bg={fileLen ? '#00000080' : '#fff'}/>}
    </EditorContext.Provider>
  );
};

const createMockData = (editor: Editor) => {

  const r1data: Omit<ShapeProps, 'id'> = {
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

  const r1: Connector = editor.batchCreate([r1data]) as Connector
  const r2: Connector = editor.batchCreate([{...r1data, x: 200, y: 200}]) as Connector

  console.log(r1.id)

  const c1data: Omit<ConnectorProps, 'id'> = {
    type: "connector",
    start: r1.id,
    end: r2.id,
    lineColor: "000",
  }
  const c1 = editor.batchCreate([c1data])

  const modules = new Map(
    [[r1.id, r1], [r2.id, r2], [c1.id, c1]]
  ) as Map<string, Modules>

  editor.batchAdd(
    modules,
    "add-modules"
  )
}