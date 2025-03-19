import {ModuleProps} from "../core/modules/modules";

export type EditorCoordinates = Position

export type BasicEditorAreaSize = {
  width: 1000
  height: 1000
}

export interface Line {
  start: Position
  end: Position
}

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