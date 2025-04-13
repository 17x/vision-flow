import {ModuleProps} from '../core/modules/modules'
import History from './history/history.ts'
import {EditorEventType} from './actions/type'

export type BasicEditorAreaSize = {
  width: 1000
  height: 1000
}

export type ModuleMoveDirection =
  'module-move-up' |
  'module-move-down' |
  'module-move-left' |
  'module-move-right' |
  'module-move-shift'
/*

export type OperationType = Pick<EditorEventType, 'select-all'
  | 'modify-selection'
  | 'selection-copy'
  | 'selection-delete'
  | 'selection-paste'
  | 'selection-move'
  | 'history-redo'
  | 'history-undo'
  | 'history-pick'
  | 'selection-duplicate'
  // | 'module-delete'
  | 'selection-clear'
  | 'module-modify'
  | 'module-move'
  | 'module-move-start'
  | 'module-move-end'> & ModuleMoveDirection
*/

export type ModifyModule = Partial<ModuleProps>
// export type ModifyModuleMap = Map<UID, ModifyModule>

export type EditorAction = {
  id: string;
  shortcut?: string;
  children?: EditorAction[];
};

/*
export interface ViewportInfo extends Size {
  offsetX: number
  offsetY: number
  scale: number
  dx: number
  dy: number
  status: string
}
*/

export interface WorldInfo extends Size {
  offsetX: number
  offsetY: number
  scale: number
  dx: number
  dy: number
  status: string
}

type InitializedHandler = () => void;
type HistoryUpdatedHandler = (history: History) => void;
type ModulesUpdatedHandler = (moduleMap: ModuleMap) => void;
type SelectionUpdatedHandler = (selected: Set<UID>, selectedProps?: ModuleProps) => void;
type ViewportUpdatedHandler = (viewportInfo: BoundingRect) => void;
type WorldUpdatedHandler = (worldInfo: WorldInfo) => void;
type WorldMouseMoveUpdatedHandler = (point: Point) => void;
type ContextMenuHandler = (idSet: Set<UID>, position: Point, copiedItems: boolean) => void;

export declare type EventHandlers = {
  onInitialized?: InitializedHandler
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
  onSelectionUpdated?: SelectionUpdatedHandler
  onViewportUpdated?: ViewportUpdatedHandler
  onWorldUpdated?: WorldUpdatedHandler
  onWorldMouseMove?: WorldMouseMoveUpdatedHandler
  onContextMenu?: ContextMenuHandler
}