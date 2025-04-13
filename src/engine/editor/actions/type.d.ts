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
  'world-resize': null;
  'world-mouse-down': never;
  'world-mouse-move': never;
  'world-update': never;
  'world-zoom': 'fit' | {
    zoomFactor: number;
    physicalPoint: Point;
  };
  'world-shift': Point;
  'visible-module-update': boolean;
  'visible-selected-update': never;
  'selection-update': never
  'selection-modify': SelectionModifyData;
  'selection-clear': never;
  'selection-all': never;
  'module-map-update': HistoryOperation;
  'module-copy': never;
  'module-add': ModuleProps[];
  'module-paste': Point;
  'module-delete': never;
  'module-move': SelectionMoveData;
  'module-duplicate': never;
  'module-modify': ModuleModifyData
  'module-operating': never
  'module-hover-enter': UID;
  'module-hover-leave': UID;
  'history-redo': never;
  'history-undo': never;
  'history-pick': HistoryNode;
  'context-menu': {
    idSet: Set<UID>;
    position: Position;
    copiedItems: boolean
  };
}