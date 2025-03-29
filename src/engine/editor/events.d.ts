import History from "./history/history.ts"

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