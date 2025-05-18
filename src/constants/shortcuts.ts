const SHORTCUTS_DATA = [
  {code: 'worldZoomIn', shortcut: 'meta+='},
  {code: 'worldZoomOut', shortcut: 'meta+-'},
  {code: 'closeFile', shortcut: 'ctrl+w,meta+w'},
  {code: 'saveFile', shortcut: 'ctrl+s,meta+s'},
  {code: 'selectionAll', shortcut: 'ctrl+a,meta+a'},
  {code: 'elementCopy', shortcut: 'ctrl+c,meta+c'},
  {code: 'elementPaste', shortcut: 'ctrl+v,meta+v'},
  {code: 'elementDuplicate', shortcut: 'ctrl+d,meta+d'},
  {code: 'elementDelete', shortcut: 'delete,backspace'},
  {code: 'selectionClear', shortcut: 'escape'},
  {code: 'historyUndo', shortcut: 'ctrl+z,meta+z'},
  {code: 'historyRedo', shortcut: 'ctrl+shift+z,meta+shift+z'},
  {code: 'elementMoveUp', shortcut: 'arrowup'},
  {code: 'elementMoveDown', shortcut: 'arrowdown'},
  {code: 'elementMoveLeft', shortcut: 'arrowleft'},
  {code: 'elementMoveRight', shortcut: 'arrowright'},
] as const

export default SHORTCUTS_DATA