import React, {createContext} from 'react';
import Editor from "../../engine/editor";
import {HistoryNode} from "../../engine/editor/history/HistoryDoublyLinkedList.ts";
import {ActionCode} from "../../engine/editor/editor";

interface EditorContextType {
  focused: boolean
  historyArray: HistoryNode[]
  historyCurrent: HistoryNode
  selectedModules: UID[]
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  executeAction: (code: ActionCode) => void
}

const EditorContext = createContext<EditorContextType>({
  focused: false,
  historyArray: [] as HistoryNode[],
  historyCurrent: {} as HistoryNode,
  selectedModules: [],
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {

  },
  executeAction: () => {

  }
});

export default EditorContext;