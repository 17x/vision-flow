type OperationHandlerType = 'resize' | 'rotate'

// Base operation handler interface
export interface OperationHandler {
  id: string; // Unique identifier for the handler
  type: HandlerType; // Type of the operation (resize, rotate, etc.)
  cursor: string; // The cursor style when hovering over the handler
  data: never; // Extra data for specific handler types (e.g., position, size)
}

type HandlerType = 'resize' | 'rotate';
type Direction =
  | 'n' | 's' | 'e' | 'w'
  | 'ne' | 'nw' | 'se' | 'sw';

interface ResizeHandler {
  id: string;
  type: HandlerType;
  cursor: string;
  data: {
    x: number;
    y: number;
    width: number;
    position: string;
    rotation: number;
  };
}

export interface RotateHandler extends OperationHandler {
  type: 'rotate';
  data: {
    x: number;
    y: number;
    radius: number;
  };
}

export type OperationHandlers = RotateHandler | ResizeHandler
export type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

