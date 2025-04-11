type OperationHandlerType = 'resize' | 'rotate'

// Base operation handler interface
export interface OperationHandler {
  id: string; // Unique identifier for the handler
  type: HandlerType; // Type of the operation (resize, rotate, etc.)
  cursor: string; // The cursor style when hovering over the handler
  data: never; // Extra data for specific handler types (e.g., position, size)
}

// Specific interface for ResizeHandler (extends base OperationHandler)
export interface ResizeHandler extends OperationHandler {
  type: 'resize';
  data: {
    x: number;
    y: number;
    width: number;
    lineWidth: number;
    position: string; // Top-left, bottom-right, etc.
    rotation: number;
  };
}

// Specific interface for RotateHandler (extends base OperationHandler)
export interface RotateHandler extends OperationHandler {
  type: 'rotate';
  data: {
    x: number;
    y: number;
    radius: number; // A radius or some dimension related to the rotation handle
  };
}

export type OperationHandlers = RotateHandler | ResizeHandler
export type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

