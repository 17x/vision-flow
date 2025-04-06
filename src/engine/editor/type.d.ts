import {ModuleProps} from "../core/modules/modules"
import History from "./history/history.ts"

export type BasicEditorAreaSize = {
  width: 1000
  height: 1000
}

export interface Line {
  start: Point
  end: Point
}

export type MoveDirection =
  'moveUp'
  | 'moveDown'
  | 'moveLeft'
  | 'moveRight'

export type ActionCode =
  'selectAll'
  | 'select'
  | 'copy'
  | 'paste'
  | 'redo'
  | 'undo'
  | 'duplicate'
  | 'delete'
  | 'escape'
  | 'modifyModules'
  | 'zoom'
  | MoveDirection

export type ModifyModule = Partial<ModuleProps>
// export type ModifyModuleMap = Map<UID, ModifyModule>

export type EditorAction = {
  id: string;
  shortcut?: string;
  children?: EditorAction[];
};

export interface ViewportInfo extends Size {
  offsetX: number
  offsetY: number
  scale: number
  dx: number
  dy: number
  status: string
}

type HistoryUpdatedHandler = (history: History) => void;
/**
 *
 */
type ModulesUpdatedHandler = (moduleMap: ModuleMap) => void;
type SelectionUpdatedHandler = (selected: Set<UID> | 'all', selectedProps?: ModuleProps) => void;
type ViewportUpdatedHandler = (viewportInfo: ViewportInfo) => void;

export declare type EventHandlers = {
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
  onSelectionUpdated?: SelectionUpdatedHandler
  onViewportUpdated?: ViewportUpdatedHandler
}