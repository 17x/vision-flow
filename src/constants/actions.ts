import {EditorAction} from '../editor/engine/type'

const editorActions: EditorAction[] = [
  {
    id: 'file',
    children: [
      {id: 'newFile', shortcut: 'ctrl+n'},
      {id: 'openFile', shortcut: 'ctrl+o'},
      {id: 'saveFile', shortcut: 'ctrl+s'},
      {id: 'saveAs'},
      {id: 'importFile'},
      {id: 'exportFile'},
      {id: 'print'},
      {id: 'closeFile'},
    ],
  },
  {
    id: 'edit',
    children: [
      {id: 'undo', editorAction: 'history-undo', shortcut: 'ctrl+z,meta+z'},
      {id: 'redo', editorAction: 'history-redo', shortcut: 'ctrl+shift+z,meta+shift+z'},
      {id: 'cut', editorAction: 'element-cut', shortcut: 'ctrl+x,meta+x'},
      {id: 'copy', editorAction: 'element-copy', shortcut: 'ctrl+c,meta+c'},
      {id: 'paste', editorAction: 'element-paste', shortcut: 'ctrl+v,meta+v'},
      {id: 'delete', editorAction: 'element-delete', shortcut: 'delete,backspace'},
      {id: 'duplicate', editorAction: 'element-duplicate', shortcut: 'ctrl+d,meta+d'},
      {id: 'selectAll', editorAction: 'selection-all', shortcut: 'ctrl+a,meta+a'},
      // {id: 'findReplace', editorAction: 'history-redo', shortcut: 'ctrl+f'},
    ],
  },
  {
    id: 'view',
    children: [
      {id: 'zoomIn', editorAction: 'history-redo', shortcut: 'ctrl+='},
      {id: 'zoomOut', shortcut: 'ctrl+-'},
      {id: 'fitToScreen'},
      {id: 'toggleGrid'},
      {id: 'toggleGuides'},
      // {id: 'fullscreenMode', shortcut: 'F11'},
    ],
  },
  {
    id: 'text',
    children: [
      {id: 'addText'},
      {id: 'editText'},
      {id: 'changeFont'},
      {id: 'changeFontSize'},
      {id: 'changeFontColor'},
      {id: 'boldText', shortcut: 'ctrl+b'},
      {id: 'italicText', shortcut: 'ctrl+i'},
      {id: 'underlineText', shortcut: 'ctrl+u'},
      {id: 'alignText'},
    ],
  },
  {
    id: 'layer',
    children: [
      {id: 'sendToBack'},
      {id: 'bringToFront'},
      {id: 'sendBackward'},
      {id: 'bringForward'},
      {id: 'duplicateLayer'},
      {id: 'deleteLayer'},
      {id: 'toggleLayerVisibility'},
    ],
  },
]

export default editorActions