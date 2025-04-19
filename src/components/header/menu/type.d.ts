
export interface MenuItemType {
  id: string
  action?: EditorEventType,
  editorActionCode?: EditorEventType,
  editorActionData?: 'up' | 'down' | 'top' | 'bottom',
  disabled: boolean
  icon?: string
  divide?: boolean
  children?: MenuItemType[]
}