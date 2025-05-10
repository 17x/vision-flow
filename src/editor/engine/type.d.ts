import {ModuleProps} from '../core/modules/modules'
import History from './history/history.ts'
import {EditorConfig} from './editor.ts'
import {ToolName} from '@editor/engine/tools/tool.ts'

export type ModuleMoveDirection =
  'module-move-up' |
  'module-move-down' |
  'module-move-left' |
  'module-move-right' |
  'module-move-shift'

export type EditorAction = {
  id: string;
  shortcut?: string;
  children?: EditorAction[];
};

export interface ViewportData extends Size {
  offsetX: number
  offsetY: number
  scale: number
  // dx: number
  // dy: number
  status: string
}

export interface WorldInfo extends Size {
  offsetX: number
  offsetY: number
  scale: number
  dx: number
  dy: number
  status: string
}

export interface SnapPointData extends Point {
  id: UID,
  type: string
}

export type InitializedHandler = () => void;
export type HistoryUpdatedHandler = (history: History) => void;
export type ModulesUpdatedHandler = (moduleMap: ModuleMap) => void;
export type SelectionUpdatedHandler = (selected: Set<UID>, selectedProps?: ModuleProps) => void;
export type ViewportUpdatedHandler = (viewportInfo: ViewportData) => void;
export type WorldUpdatedHandler = (worldInfo: WorldInfo) => void;
export type WorldMouseMoveUpdatedHandler = (point: Point) => void;
export type ContextMenuHandler = (position: Point) => void;
export type ModuleCopiedHandler = (ModuleProps) => void;
export type SwitchToolHandler = (toolName: ToolName) => void;

export declare type EventHandlers = {
  onInitialized?: InitializedHandler
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
  onSelectionUpdated?: SelectionUpdatedHandler
  onViewportUpdated?: ViewportUpdatedHandler
  onWorldUpdated?: WorldUpdatedHandler
  onWorldMouseMove?: WorldMouseMoveUpdatedHandler
  onContextMenu?: ContextMenuHandler
  onModuleCopied?: ModuleCopiedHandler
  onSwitchTool?: SwitchToolHandler
}

export interface EditorExportFileType {
  data: ModuleProps[]
  id: UID,
  config: EditorConfig
}

export interface EditorConfig {
  dpr: number;
  page: {
    // name: string
    unit: string
    width: number
    height: number
  }
}

export interface EditorInterface {
  container: HTMLDivElement
  elements: ModuleProps[]
  events?: EventHandlers;
  config: EditorConfig;
}

export type {ToolName} from '@editor/engine/tools/tool.ts'