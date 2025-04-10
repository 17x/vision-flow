import { SelectionActionMode } from "../selection/type"
import { HistoryNode } from "../history/DoublyLinkedList.ts"
import { ModuleMoveDirection } from "../type"

/*export interface EventBase<T extends string, P> {
  type: T;
  data: P;
}*/

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

export type EditorEventMap = {
  "editor-initialized": never;
  "visible-module-update": ModuleMap;
  "visible-selected-update": { idSet: Set<UID>; operators: never };
  "selection-modify": SelectionModifyData;
  "selection-copy": never;
  "selection-paste": never;
  "selection-duplicate": never;
  "selection-move": SelectionMoveData;
  "selection-clear": never;
  "selection-delete": never;
  "select-all": never;
  "module-paste": never;
  "module-redo": never;
  "module-undo": never;
  "module-duplicate": never;
  "module-delete": never;
  "module-modify": never;
  "module-move": never;
  "module-move-start": never;
  "module-move-end": never;
  "module-move-up": never;
  "module-move-down": never;
  "module-move-left": never;
  "module-move-right": never;
  "history-redo": never;
  "history-undo": never;
  "history-pick": HistoryNode;
  "viewport-resize": null;
  "viewport-mouse-down": never;
  "viewport-mouse-move": never;
  "viewport-mouse-up": never;
  "world-zoom": {
    zoomFactor: number;
    physicalPoint: Point;
  };
  "world-shift": Point;
  "world-update": never;
  "world-mouse-move": never;
  "context-menu": {
    idSet: Set<UID>;
    position: Position;
  };
};

/*
export type EditorEvents =
  | EditorInitializedEvent
  | VisibleModuleUpdate
  | VisibleSelectedUpdate
  | SelectAllEvent
  | SelectionModifyEvent
  | SelectionCopyEvent
  | SelectionPasteEvent
  | SelectionDuplicateEvent
  | SelectionMove
  | SelectionClearEvent
  | SelectionDeleteEvent
  | ModulePasteEvent
  | ModuleRedoEvent
  | ModuleUndoEvent
  | ModuleDuplicateEvent
  | ModuleDeleteEvent
  | ModuleModifyEvent
  | ModuleMoveEvent
  | ModuleMoveStartEvent
  | ModuleMoveEndEvent
  | ModuleMoveUpEvent
  | ModuleMoveDownEvent
  | ModuleMoveLeftEvent
  | ModuleMoveRightEvent
  | HistoryRedoEvent
  | HistoryUndoEvent
  | HistoryPickEvent
  | ViewportResizeEvent
  | ViewportMouseDownEvent
  | ViewportMouseMoveEvent
  | ViewportMouseUpEvent
  | WorldZoomEvent
  | WorldShiftEvent
  | WorldUpdateEvent
  | WorldMouseMoveEvent
  | ContextMenuEvent;*/
/*
export interface EventBase<T extends string, P> {
  type: T;
  data: P;
}

export interface SelectionModifyData {
  mode: SelectionActionMode;
  idSet: Set<UID>;
}*/
/*

export type EditorInitializedEvent = EventBase<"editor-initialized", never>;

export type VisibleModuleUpdate = EventBase<"visible-module-update", ModuleMap>;
export type VisibleSelectedUpdate = EventBase<
  "visible-selected-update",
  { idSet: Set<UID>; operators: never }
>;

export type SelectionModifyEvent = EventBase<
  "selection-modify",
  SelectionModifyData
>;
export type SelectionClearEvent = EventBase<"selection-clear", null>;
export type SelectionCopyEvent = EventBase<"selection-copy", never>;
export type SelectionPasteEvent = EventBase<"selection-paste", never>;
export type SelectionDuplicateEvent = EventBase<"selection-duplicate", never>;
export type SelectionDeleteEvent = EventBase<"selection-delete", never>;
/!*export type SelectionMoveData = {
  direction: ModuleMoveDirection;
  delta?: Point;
};*!/
export type SelectionMove = EventBase<"selection-move", SelectionMoveData>;
export type SelectAllEvent = EventBase<"select-all", null>;

export type ModulePasteEvent = EventBase<"selection-paste", never>;
export type ModuleRedoEvent = EventBase<"module-redo", never>;
export type ModuleUndoEvent = EventBase<"module-undo", never>;
export type ModuleDuplicateEvent = EventBase<"selection-duplicate", never>;
export type ModuleDeleteEvent = EventBase<"module-delete", never>;
export type ModuleModifyEvent = EventBase<"module-modify", never>;
export type ModuleMoveEvent = EventBase<"module-move", never>;
export type ModuleMoveStartEvent = EventBase<"module-move-start", never>;
export type ModuleMoveEndEvent = EventBase<"module-move-end", never>;
export type ModuleMoveUpEvent = EventBase<"module-move-up", never>;
export type ModuleMoveDownEvent = EventBase<"module-move-down", never>;
export type ModuleMoveLeftEvent = EventBase<"module-move-left", never>;
export type ModuleMoveRightEvent = EventBase<"module-move-right", never>;

export type HistoryRedoEvent = EventBase<"history-redo", null>;
export type HistoryUndoEvent = EventBase<"history-undo", null>;
export type HistoryPickEvent = EventBase<"history-pick", HistoryNode>;

export type ViewportResizeEvent = EventBase<"viewport-resize", null>;
export type ViewportMouseDownEvent = EventBase<"viewport-mouse-down", never>;
export type ViewportMouseMoveEvent = EventBase<"viewport-mouse-move", never>;
export type ViewportMouseUpEvent = EventBase<"viewport-mouse-up", never>;
export type WorldZoomEvent = EventBase<
  "world-zoom",
  {
    zoomFactor: number;
    physicalPoint: Point;
  }
>;
export type WorldShiftEvent = EventBase<"world-shift", Point>;
export type WorldUpdateEvent = EventBase<"world-update">;
export type WorldMouseMoveEvent = EventBase<"world-mouse-move">;

export type ContextMenuEvent = EventBase<
  "context-menu",
  {
    idSet: Set<UID>;
    position: Position;
  }
>;
*/
