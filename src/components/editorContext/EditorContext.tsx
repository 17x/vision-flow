import React, {createContext} from 'react';
import Editor from "../../engine/editor";
import {HistoryNode} from "../../engine/editor/history/HistoryDoublyLinkedList.ts";
import {ActionCode} from "../../engine/editor/editor";

interface EditorContextType {
  historyArray: HistoryNode[]
  historyCurrent: HistoryNode
  editorRef: React.RefObject<Editor | null>
  applyHistoryNode: (node: HistoryNode) => void
  executeAction: (code: ActionCode) => void
}

const EditorContext = createContext<EditorContextType>({
  historyArray: [] as HistoryNode[],
  historyCurrent: {} as HistoryNode,
  editorRef: {} as React.RefObject<Editor>,
  applyHistoryNode: () => {

  },
  executeAction: () => {

  }
});

export default EditorContext;