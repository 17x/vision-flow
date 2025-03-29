import {ModuleProps} from "../core/modules/modules"
import History from "./history/history.ts"

export type BasicEditorAreaSize = {
  width: 1000
  height: 1000
}

export interface Line {
  start: Position
  end: Position
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
  | MoveDirection

export type ModifyModule = Partial<ModuleProps>
// export type ModifyModuleMap = Map<UID, ModifyModule>

export type EditorAction = {
  id: string;
  shortcut?: string;
  children?: EditorAction[];
};

type HistoryUpdatedHandler = (history: History) => void;
/**
 *
 */
type ModulesUpdatedHandler = (moduleMap: ModuleMap) => void;
type SelectionUpdatedHandler = (selected: Set<UID>) => void;

export declare type EventHandlers = {
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
  onSelectionUpdated?: SelectionUpdatedHandler
}