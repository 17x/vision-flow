import {SelectionActionMode} from '../selection/type'

type EditorEventType = EditorEvents['type'];
type EditorEventData = EditorEvents['data'];

export type EditorEvents =
  | EditorInitializedEvent
  | VisibleModuleUpdate
  | VisibleSelectedUpdate
  | SelectAllEvent
  | SelectionModifyEvent
  | SelectionCopyEvent
  | ModulePasteEvent
  | ModuleRedoEvent
  | ModuleUndoEvent
  | ModuleDuplicateEvent
  | ModuleDeleteEvent
  | SelectionClearEvent
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
  | ViewportPanningEvent
  | WorldZoomEvent
  | WorldShiftEvent
  | WorldUpdateEvent
  | WorldMouseMoveEvent;

export interface EventBase<T, P> {
  type: T;
  data: P;
}

export interface SelectionModifyData {
  mode: SelectionActionMode;
  idSet: Set<UID>;
}

export type EditorInitializedEvent = EventBase<'editor-initialized', never>

export type VisibleModuleUpdate = EventBase<'visible-module-update', ModuleMap>
export type VisibleSelectedUpdate = EventBase<'visible-selected-update', { idSet: Set<UID>; operators: never }>

export type SelectionModifyEvent = EventBase<'selection-modify', SelectionModifyData>
export type SelectionClearEvent = EventBase<'selection-clear', null>;
export type SelectionCopyEvent = EventBase<'selection-copy', never>;
export type SelectAllEvent = EventBase<'select-all', null>;

export type ModulePasteEvent = EventBase<'module-paste', never>;
export type ModuleRedoEvent = EventBase<'module-redo', never>;
export type ModuleUndoEvent = EventBase<'module-undo', never>;
export type ModuleDuplicateEvent = EventBase<'module-duplicate', never>;
export type ModuleDeleteEvent = EventBase<'module-delete', never>;
export type ModuleModifyEvent = EventBase<'module-modify', never>;
export type ModuleMoveEvent = EventBase<'module-move', never>;
export type ModuleMoveStartEvent = EventBase<'module-move-start', never>;
export type ModuleMoveEndEvent = EventBase<'module-move-end', never>;
export type ModuleMoveUpEvent = EventBase<'module-move-up', never>;
export type ModuleMoveDownEvent = EventBase<'module-move-down', never>;
export type ModuleMoveLeftEvent = EventBase<'module-move-left', never>;
export type ModuleMoveRightEvent = EventBase<'module-move-right', never>;

export type HistoryInitEvent = EventBase<'history-init', never>;
export type HistoryAddEvent = EventBase<'history-add', never>;
export type HistoryDeleteEvent = EventBase<'history-delete', never>;
export type HistoryPasteEvent = EventBase<'history-paste', never>;
export type HistoryDuplicateEvent = EventBase<'history-duplicate', never>;
export type HistoryModifyEvent = EventBase<'history-modify', never>;
export type HistoryMoveEvent = EventBase<'history-move', never>;
export type HistoryReorderEvent = EventBase<'history-reorder', never>;
export type HistorySelectEvent = EventBase<'history-select', never>;
export type HistoryGroupEvent = EventBase<'history-group', never>;
export type HistoryUngroupEvent = EventBase<'history-ungroup', never>;
export type HistoryCompositeEvent = EventBase<'history-composite', never>;

export type ViewportResizeEvent = EventBase<'viewport-resize', null>;
export type ViewportMouseDownEvent = EventBase<'viewport-mouse-down', never>;
export type ViewportMouseMoveEvent = EventBase<'viewport-mouse-move', never>;
export type ViewportMouseUpEvent = EventBase<'viewport-mouse-up', never>;
export type ViewportPanningEvent = EventBase<'viewport-panning', Point>;
export type WorldZoomEvent = EventBase<'world-zoom', never>;
export type WorldShiftEvent = EventBase<'world-shift', BoundingRect>;
export type WorldUpdateEvent = EventBase<'world-update', BoundingRect>;
export type WorldMouseMoveEvent = EventBase<'world-mouse-move', Point>;
