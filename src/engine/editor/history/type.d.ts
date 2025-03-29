import {HistoryUpdatedHandler, ModulesUpdatedHandler, SelectionUpdatedHandler} from "./events"

export type HistoryActionType =
  'init'
  | 'addModules'
  | 'deleteModules'
  | 'pasteModules'
  | 'duplicateModules'
  | 'modifyModules'

type HistoryPrev = HistoryNode | null;
type HistoryNext = HistoryPrev

/**
 * For type equal to init:
 *  { id : 0, type:'init', data:null }
 */
export interface HistoryNodeData {
  type: HistoryActionType
  modules?: ModuleProps[]
  selectModules: Set<UID> | 'all'
}
export interface EventHandlers1 {
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
  onSelectionUpdated?: SelectionUpdatedHandler
}