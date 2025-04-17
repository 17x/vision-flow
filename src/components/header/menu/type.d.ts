import {EditorEventType} from '../../../engine/editor/actions/type'

export interface MenuType {
  id: string
  editorActionCode?: EditorEventType,
  editorActionData?: 'up' | 'down' | 'top' | 'bottom',
  disabled: boolean
  divide?: boolean
  children?: MenuType[]
}