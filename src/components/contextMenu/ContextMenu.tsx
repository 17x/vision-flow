import {FC, useContext, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {I18nHistoryDataItem} from '../../i18n/type'
import EditorContext from '../editorContext/EditorContext.tsx'

export interface ContextMenuDataType {
  idSet: Set<number>
  position: { x: number, y: number }
  copiedItems: boolean
}

export interface ContextMenuProps {
  data: ContextMenuDataType
  // onAction: (action: string) => void
  onClose: () => void
}

export const ContextMenu: FC<ContextMenuProps> = ({data: {idSet, position, copiedItems}, onClose}) => {
  const {t} = useTranslation()
  const {executeAction} = useContext(EditorContext)

  useEffect(() => {
    const remove = () => {
      onClose()
    }

    window.addEventListener('click', remove)

    return () => {
      window.removeEventListener('click', remove)
    }
  }, [idSet, position])

  const menuItems = [
    {id: 'copy', disabled: idSet.size === 0},
    {id: 'paste', disabled: !copiedItems},
    {id: 'delete', disabled: idSet.size === 0},
    {id: 'duplicate', disabled: idSet.size === 0},
    // {id: 'group', disabled: idSet.size < 2},
    // {id: 'ungroup', disabled: idSet.size === 0},
    // {id: 'lock', disabled: idSet.size === 0},
    // {id: 'unlock', disabled: idSet.size === 0},
    {id: 'bringToFront', disabled: idSet.size === 0},
    {id: 'sendToBack', disabled: idSet.size === 0},
  ]
  const handleContextAction = (action: string) => {
    // console.log(action)
    switch (action) {
      case 'copy':
        executeAction('selection-copy')
        break
      case 'paste':
        executeAction('selection-paste')
        break
      case 'delete':
        executeAction('selection-delete')
        break
      case 'duplicate':
        executeAction('selection-duplicate')
        break
    }
    // executeAction()
  }
  return (
    <div className="absolute bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50"
         style={{
           top: position.y,
           left: position.x,
         }}>
      {menuItems.map((item, index) => {
        const menuText = t(item.id, {returnObjects: true}) as I18nHistoryDataItem
        const showDivider = index === 2 || index === 4 || index === 7

        return (
          <div key={item.id}>
            {showDivider && <div className="border-t border-gray-200 my-1"/>}
            <button
              className={`w-full px-4 py-1.5 text-left text-sm hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
              disabled={item.disabled}
              onClick={() => handleContextAction(item.id)}
              title={menuText.tooltip}
            >
              {menuText.label}
            </button>
          </div>
        )
      })}
    </div>
  )
}