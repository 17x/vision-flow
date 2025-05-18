const ACTIONS = [
  {
    id: 'file',
    children: [
      {id: 'newFile', shortcut: 'ctrl+n'},
      {id: 'openFile', shortcut: 'ctrl+o'},
      {id: 'saveFile', shortcut: 'ctrl+s,meta+s'},
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
      {id: 'elementMoveUp', editorAction: 'world-zoom', shortcut: 'arrowup'},
      {id: 'elementMoveDown', editorAction: 'world-zoom', shortcut: 'arrowdown'},
      {id: 'elementMoveLeft', editorAction: 'world-zoom', shortcut: 'arrowleft'},
      {id: 'elementMoveRight', editorAction: 'world-zoom', shortcut: 'arrowright'},
      // {id: 'findReplace', editorAction: 'history-redo', shortcut: 'ctrl+f'},
    ],
  },
  {
    id: 'view',
    children: [
      {id: 'zoomIn', editorAction: 'history-redo', shortcut: 'ctrl+=,meta+='},
      {id: 'zoomOut', shortcut: 'ctrl+-,meta+-'},
      {id: 'fitToScreen'},
      // {id: 'toggleGrid'},
      // {id: 'toggleGuides'},
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
      {id: 'boldText', shortcut: 'ctrl+b,meta+b'},
      {id: 'italicText', shortcut: 'ctrl+i,meta+i'},
      {id: 'underlineText', shortcut: 'ctrl+u,meta+u'},
      {id: 'alignText'},
    ],
  },
  {
    id: 'layer',
    children: [
      {id: 'sendToBack', editorAction: ''},
      {id: 'bringToFront', editorAction: ''},
      {id: 'sendBackward', editorAction: '', shortcut: 'shift'},
      {id: 'bringForward', editorAction: '', shortcut: 'shift'},
      // {id: 'duplicateLayer', editorAction: ''},
      // {id: 'deleteLayer', editorAction: ''},
    ],
  },
]

export const FILE = {
  id: 'file',
  disabled: false,
  children: [
    {id: 'newFile', disabled: false, shortcut: 'ctrl+n'},
    {id: 'openFile', disabled: false, shortcut: 'ctrl+o'},
    {id: 'importFile', disabled: false},
    {id: 'saveFile', shortcut: 'ctrl+s,meta+s'},
    {id: 'saveAs', disabled: false},
    {
      id: 'exportFile',
      disabled: false,
      children: [
        {id: 'exportFile_png', disabled: false},
        {id: 'exportFile_pdf', disabled: false},
        {id: 'exportFile_csv', disabled: false},
      ],
    },
    {id: 'print', disabled: false},
    {id: 'closeFile', disabled: false},
  ],
}

export const EDIT = {
  id: 'edit',
  children: [
    {id: 'undo', disabled: false, editorAction: 'history-undo', shortcut: 'ctrl+z,meta+z'},
    {id: 'redo', disabled: false, editorAction: 'history-redo', shortcut: 'ctrl+shift+z,meta+shift+z'},
    {id: 'cut', disabled: false, editorAction: 'element-cut', shortcut: 'ctrl+x,meta+x'},
    {id: 'copy', disabled: false, editorAction: 'element-copy', shortcut: 'ctrl+c,meta+c'},
    {id: 'paste', disabled: false, editorAction: 'element-paste', shortcut: 'ctrl+v,meta+v'},
    {id: 'delete', disabled: false, editorAction: 'element-delete', shortcut: 'delete,backspace'},
    {id: 'duplicate', disabled: false, editorAction: 'element-duplicate', shortcut: 'ctrl+d,meta+d'},
    {id: 'selectAll', disabled: false, editorAction: 'selection-all', shortcut: 'ctrl+a,meta+a'},
    {id: 'elementMoveUp', disabled: false, editorAction: 'world-zoom', shortcut: 'arrowup'},
    {id: 'elementMoveDown', disabled: false, editorAction: 'world-zoom', shortcut: 'arrowdown'},
    {id: 'elementMoveLeft', disabled: false, editorAction: 'world-zoom', shortcut: 'arrowleft'},
    {id: 'elementMoveRight', disabled: false, editorAction: 'world-zoom', shortcut: 'arrowright'},
    // {id: 'findReplace', editorAction: 'history-redo', shortcut: 'ctrl+f'},
  ],
}

export const VIEW = {
  id: 'view',
  disabled: false,
  children: [
    {id: 'zoomIn', disabled: false, editorAction: 'history-redo', shortcut: 'ctrl+=,meta+='},
    {id: 'zoomOut', disabled: false, shortcut: 'ctrl+-,meta+-'},
    {id: 'fitToScreen', disabled: false},
    // {id: 'toggleGrid'},
    // {id: 'toggleGuides'},
    // {id: 'fullscreenMode', shortcut: 'F11'},
  ],
}

export default ACTIONS