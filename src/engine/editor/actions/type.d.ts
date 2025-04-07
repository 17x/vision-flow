// import {ModuleOperationType} from '../type'
// import {ViewportEventType} from '../viewport/type'
// import {HistoryOperationType} from '../history/type'

/*type EditorEventType =
  | 'editor-initialized'
  | ModuleOperationType
  | HistoryOperationType
  | ViewportEventType;*/

type EditorEventType = EditorEvents['type']
type EditorEventData = EditorEvents['data']

export type EditorEvents =
  | EditorInitializedEvent
  | ModuleSelectAllEvent
  | ModuleSelectEvent
  | ModuleCopyEvent
  | ModulePasteEvent
  | ModuleRedoEvent
  | ModuleUndoEvent
  | ModuleDuplicateEvent
  | ModuleDeleteEvent
  | ModuleEscapeEvent
  | ModuleModifyEvent
  | ModuleMoveEvent
  | ModuleMoveStartEvent
  | ModuleMoveEndEvent
  | ModuleMoveUpEvent
  | ModuleMoveDownEvent
  | ModuleMoveLeftEvent
  | ModuleMoveRightEvent
  | HistoryInitEvent
  | HistoryAddEvent
  | HistoryDeleteEvent
  | HistoryPasteEvent
  | HistoryDuplicateEvent
  | HistoryModifyEvent
  | HistoryMoveEvent
  | HistoryReorderEvent
  | HistorySelectEvent
  | HistoryGroupEvent
  | HistoryUngroupEvent
  | HistoryCompositeEvent
  | ViewportResizeEvent
  | ViewportMouseDownEvent
  | ViewportMouseMoveEvent
  | ViewportMouseUpEvent
  | WorldZoomEvent
  | WorldShiftEvent
  | WorldMouseMoveEvent

export interface EditorInitializedEvent {
  type: 'editor-initialized';
  data: never;
}

export interface ModuleSelectAllEvent {
  type: 'module-select-all';
  data: never;
}

export interface ModuleSelectEvent {
  type: 'module-select';
  data: never;
}

export interface ModuleCopyEvent {
  type: 'module-copy';
  data: never;
}

export interface ModulePasteEvent {
  type: 'module-paste';
  data: never;
}

export interface ModuleRedoEvent {
  type: 'module-redo';
  data: never;
}

export interface ModuleUndoEvent {
  type: 'module-undo';
  data: never;
}

export interface ModuleDuplicateEvent {
  type: 'module-duplicate';
  data: never;
}

export interface ModuleDeleteEvent {
  type: 'module-delete';
  data: never;
}

export interface ModuleEscapeEvent {
  type: 'module-escape';
  data: never;
}

export interface ModuleModifyEvent {
  type: 'module-modify';
  data: never;
}

export interface ModuleMoveEvent {
  type: 'module-move';
  data: never;
}

export interface ModuleMoveStartEvent {
  type: 'module-move-start';
  data: never;
}

export interface ModuleMoveEndEvent {
  type: 'module-move-end';
  data: never;
}

export interface ModuleMoveUpEvent {
  type: 'module-move-up';
  data: never;
}

export interface ModuleMoveDownEvent {
  type: 'module-move-down';
  data: never;
}

export interface ModuleMoveLeftEvent {
  type: 'module-move-left';
  data: never;
}

export interface ModuleMoveRightEvent {
  type: 'module-move-right';
  data: never;
}

export interface HistoryInitEvent {
  type: 'history-init';
  data: never;
}

export interface HistoryAddEvent {
  type: 'history-add';
  data: never;
}

export interface HistoryDeleteEvent {
  type: 'history-delete';
  data: never;
}

export interface HistoryPasteEvent {
  type: 'history-paste';
  data: never;
}

export interface HistoryDuplicateEvent {
  type: 'history-duplicate';
  data: never;
}

export interface HistoryModifyEvent {
  type: 'history-modify';
  data: never;
}

export interface HistoryMoveEvent {
  type: 'history-move';
  data: never;
}

export interface HistoryReorderEvent {
  type: 'history-reorder';
  data: never;
}

export interface HistorySelectEvent {
  type: 'history-select';
  data: never;
}

export interface HistoryGroupEvent {
  type: 'history-group';
  data: never;
}

export interface HistoryUngroupEvent {
  type: 'history-ungroup';
  data: never;
}

export interface HistoryCompositeEvent {
  type: 'history-composite';
  data: never;
}

export interface ViewportResizeEvent {
  type: 'viewport-resize';
  data?: null;
}

export interface ViewportMouseDownEvent {
  type: 'viewport-mouse-down';
  data: never;
}

export interface ViewportMouseMoveEvent {
  type: 'viewport-mouse-move';
  data: never;
}

export interface ViewportMouseUpEvent {
  type: 'viewport-mouse-up'
  data: never;
}

export interface WorldZoomEvent {
  type: 'world-zoom';
  data: never;
}

export interface WorldMouseMoveEvent {
  type: 'world-mouse-move'
  data: Point
}

export interface WorldShiftEvent {
  type: 'world-shift';
  data: BoundingRect
}
