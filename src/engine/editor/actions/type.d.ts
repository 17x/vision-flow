import {SelectionActionMode} from '../selection/type'
import {HistoryNode} from '../history/DoublyLinkedList.ts'
import {ModuleMoveDirection} from '../type'
import {HistoryOperation} from '../history/type'

export interface SelectionModifyData {
  mode: SelectionActionMode;
  idSet: Set<UID>;
}

export type EditorEventType = keyof EditorEventMap;
export type EditorEventData<T extends EditorEventType> = EditorEventMap[T];

export type SelectionMoveData = {
  direction: ModuleMoveDirection;
  delta?: Point;
};

export type PropChange<T> = {
  from: T
  to: T
}

export type ModuleChangeProps = {
  [K in keyof ModuleProps]?: PropChange<ModuleProps[K]>
}

export interface ModuleModifyData {
  id: UID
  props: ModuleChangeProps
}

export type EditorEventMap = {
  'editor-initialized': never;
  'editor-module-map-update': HistoryOperation;
  /*
  * selected has been changed
  * */
  'editor-selection-update': never
  'visible-module-update': boolean;
  'visible-selected-update': never;
  'modify-selection': SelectionModifyData;
  'selection-clear': never;
  'selection-copy': never;
  'selection-paste': Point;
  'selection-duplicate': never;
  'selection-move': SelectionMoveData;
  'selection-delete': never;
  'select-all': never;
  'module-add': ModuleProps[];
  'module-modify': ModuleModifyData
  'module-operating': never
  'module-hover-enter': UID;
  'module-hover-leave': UID;
  'history-redo': never;
  'history-undo': never;
  'history-pick': HistoryNode;
  'viewport-resize': null;
  'viewport-mouse-down': never;
  'viewport-mouse-move': never;
  'viewport-mouse-up': never;
  'world-zoom': 'fit' | {
    zoomFactor: number;
    physicalPoint: Point;
  };
  'world-shift': Point;
  'world-update': never;
  'world-mouse-move': never;
  'context-menu': {
    idSet: Set<UID>;
    position: Position;
    copiedItems: boolean
  };
}