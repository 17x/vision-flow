import History from "./history/history.ts";

type OnHistoryUpdated = (history: History) => void;

export declare type EventHandlers = {
  onHistoryUpdated?: OnHistoryUpdated
}