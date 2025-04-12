type OperationHandlerType = 'resize' | 'rotate'

type HandlerType = 'resize' | 'rotate';

export type ResizeHandleName =
  | 'tl'
  | 't'
  | 'tr'
  | 'r'
  | 'br'
  | 'b'
  | 'bl'
  | 'l'
  | 'rotate-tl'
  | 'rotate-tr'
  | 'rotate-br'
  | 'rotate-bl'

interface ResizeTransform {
  dx: number;
  dy: number;
  cx: number;
  cy: number;
}

// Base operation handler interface
export interface OperationHandler {
  id: string; // Unique identifier for the handler
  type: HandlerType; // Type of the operation (resize, rotate, etc.)
  cursor: string; // The cursor style when hovering over the handler
  data: {
    x: number;
    y: number;
    size: number;
    lineWidth: number
    rotation: number;
  };
}

interface ResizeHandler extends OperationHandler {
  type: 'resize';
  name: ResizeHandleName
  cursor: ResizeCursor;
  moduleOrigin: ModuleProps
}

export interface RotateHandler extends OperationHandler {
  type: 'rotate';
}

export type OperationHandlers = RotateHandler | ResizeHandler
export type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

