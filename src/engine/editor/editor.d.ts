import {ModuleProps} from "../core/modules/modules";

export type BasicEditorAreaSize = {
  width: 1000
  height: 1000
}

export interface Line {
  start: Position
  end: Position
}

export type MoveDirection = | 'moveUp'
  | 'moveDown'
  | 'moveLeft'
  | 'moveRight'
export type ActionCode =
  'select-all'
  | 'copy'
  | 'paste'
  | 'redo'
  | 'undo'
  | 'duplicate'
  | 'delete'
  | 'escape'
  | 'modify-modules'
  | MoveDirection

export type ShortcutCode = 'move'

export type HistoryActionType =
  'init'
  | 'add-modules'
  | 'delete-modules'
  | 'paste-modules'
  | 'duplicate-modules'
  | 'modify-modules'

export type ModifyModule = Partial<ModuleProps>
export type ModifyModuleMap = Map<UID, ModifyModule>

export type EditorAction = {
  id: string;
  shortcut?: string;
  children?: EditorAction[];
};