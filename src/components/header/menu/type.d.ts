import {EditorEventType} from '../../../engine/editor/actions/type'

export interface MenuItemType {
  id: string
  editorActionCode?: EditorEventType,
  editorActionData?: 'up' | 'down' | 'top' | 'bottom',
  disabled: boolean
  icon?: string
  divide?: boolean
  children?: MenuItemType[]
}