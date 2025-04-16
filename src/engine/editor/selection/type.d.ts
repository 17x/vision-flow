export type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

type HandlerType = 'move' | 'resize' | 'rotate';

export enum ResizeDirection {
  N = 'n',
  S = 's',
  E = 'e',
  W = 'w',
  NE = 'ne',
  NW = 'nw',
  SE = 'se',
  SW = 'sw',
}

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

export interface OperationHandler {
  id: string;
  type: HandlerType
  /*
  * moduleOrigin is a detailed representation of the corresponding module instance.
  * */
  moduleOrigin: ModuleProps
  module: ModuleInstance
}

interface ResizeHandler extends OperationHandler {
  type: 'resize';
  name: ResizeHandleName
}

export interface RotateHandler extends OperationHandler {
  type: 'rotate';
}

export interface MoveHandler extends OperationHandler {
  type: 'move';
}

export type OperationHandlers = RotateHandler | ResizeHandler | MoveHandler

