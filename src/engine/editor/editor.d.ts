import {ModuleProps} from "../core/modules/modules";

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
export type ModifyModuleMap = Map<UID, ModifyModule>

export type EditorAction = {
  id: string;
  shortcut?: string;
  children?: EditorAction[];
};