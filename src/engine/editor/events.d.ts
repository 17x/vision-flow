import History from "./history/history.ts";

type HistoryUpdatedHandler = (history: History) => void;
/**
 *
 */
type ModulesUpdatedHandler = (moduleMap: ModuleMap) => void;

export declare type EventHandlers = {
  onHistoryUpdated?: HistoryUpdatedHandler
  onModulesUpdated?: ModulesUpdatedHandler
}