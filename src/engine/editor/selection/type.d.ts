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
  id: string;
  type: HandlerType; // Type of the operation (resize, rotate, etc.)
  // cursor: string; // The cursor style when hovering over the handler
  moduleOrigin: { cx: number, cy: number, width: number, height: number }
  module: ModuleInstance
}

interface ResizeHandler extends OperationHandler {
  type: 'resize';
  name: ResizeHandleName
  // cursor: ResizeCursor;
}

export interface RotateHandler extends OperationHandler {
  type: 'rotate';
}

export type OperationHandlers = RotateHandler | ResizeHandler
export type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

