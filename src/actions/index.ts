import {EditorAction} from "../engine/editor/editor"

const editorActions: EditorAction[] = [
  {
    id: "file",
    children: [
      { id: "newFile", shortcut: "Ctrl+N" },
      { id: "openFile", shortcut: "Ctrl+O" },
      { id: "saveFile", shortcut: "Ctrl+S" },
      { id: "saveAs" },
      { id: "importFile" },
      { id: "exportFile" },
      { id: "print" },
      { id: "closeFile" }
    ]
  },
  {
    id: "edit",
    children: [
      { id: "undo", shortcut: "Ctrl+Z" },
      { id: "redo", shortcut: "Ctrl+Y" },
      { id: "cut", shortcut: "Ctrl+X" },
      { id: "copy", shortcut: "Ctrl+C" },
      { id: "paste", shortcut: "Ctrl+V" },
      { id: "delete", shortcut: "Del" },
      { id: "duplicate", shortcut: "Ctrl+D" },
      { id: "selectAll", shortcut: "Ctrl+A" },
      { id: "findReplace", shortcut: "Ctrl+F" }
    ]
  },
  {
    id: "view",
    children: [
      { id: "zoomIn", shortcut: "Ctrl++" },
      { id: "zoomOut", shortcut: "Ctrl+-" },
      { id: "fitToScreen" },
      { id: "toggleGrid" },
      { id: "toggleGuides" },
      { id: "fullscreenMode", shortcut: "F11" }
    ]
  },
  {
    id: "shape",
    children: [
      { id: "addNode" },
      { id: "deleteNode" },
      { id: "moveNode" },
      { id: "resizeNode" },
      { id: "rotateNode" },
      { id: "changeNodeColor" },
      { id: "changeNodeBorder" },
      { id: "changeNodeText" },
      { id: "groupNodes" },
      { id: "ungroupNodes" },
      { id: "lockNode" },
      { id: "unlockNode" }
    ]
  },
  {
    id: "connection",
    children: [
      { id: "addEdge" },
      { id: "deleteEdge" },
      { id: "changeEdgeStyle" },
      { id: "changeEdgeColor" },
      { id: "changeEdgeLabel" },
      { id: "reverseEdge" }
    ]
  },
  {
    id: "text",
    children: [
      { id: "addText" },
      { id: "editText" },
      { id: "changeFont" },
      { id: "changeFontSize" },
      { id: "changeFontColor" },
      { id: "boldText", shortcut: "Ctrl+B" },
      { id: "italicText", shortcut: "Ctrl+I" },
      { id: "underlineText", shortcut: "Ctrl+U" },
      { id: "alignText" }
    ]
  },
  {
    id: "layer",
    children: [
      { id: "sendToBack" },
      { id: "bringToFront" },
      { id: "sendBackward" },
      { id: "bringForward" },
      { id: "duplicateLayer" },
      { id: "deleteLayer" },
      { id: "toggleLayerVisibility" }
    ]
  },
  {
    id: "collaboration",
    children: [
      { id: "addComment" },
      { id: "editComment" },
      { id: "deleteComment" },
      { id: "shareDocument" },
      { id: "liveCollaboration" }
    ]
  },
  {
    id: "ai",
    children: [
      { id: "autoLayout" },
      { id: "smartSuggest" },
      { id: "autoColor" },
      { id: "speechToText" }
    ]
  }
]

export default editorActions