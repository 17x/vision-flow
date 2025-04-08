type OperationHandlerType = 'resize' | 'rotate'

export interface OperationHandler {
  id: UID
  type: OperationHandlerType
  data: never
}

export type SelectionActionMode = 'add' | 'delete' | 'toggle' | 'replace'

