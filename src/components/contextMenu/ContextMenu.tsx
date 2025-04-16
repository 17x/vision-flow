import {FC, useContext, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {I18nHistoryDataItem} from '../../i18n/type'
import EditorContext from '../editorContext/EditorContext.tsx'
import {LuChevronRight} from 'react-icons/lu'

export interface ContextMenuDataType {
  idSet: Set<UID>
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
  const groupClass = 'absolute bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50'

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
    {
      id: 'layer',
      disabled: idSet.size === 0,
      children: [
        {id: 'sendToBack', disabled: idSet.size === 0},
        {id: 'bringToFront', disabled: idSet.size === 0},
        {id: 'sendBackward', disabled: idSet.size === 0},
        {id: 'bringForward', disabled: idSet.size === 0},
      ],
    },
  ]
  const handleContextAction = (action: string) => {
    // console.log(action)
    switch (action) {
      case 'copy':
        executeAction('module-copy')
        break
      case 'paste':
        executeAction('module-paste', position)
        break
      case 'delete':
        executeAction('module-delete')
        break
      case 'duplicate':
        executeAction('module-duplicate')
        break
    }
    // executeAction()
  }

  const MenuItem = ({item}) => {
    const menuText = t(item.id, {returnObjects: true}) as I18nHistoryDataItem
    // const showDivider = index === 2 || index === 4 || index === 7
    const showChild = item.children && item.children.length > 0

    return <div
      className={`flex justify-between min-w-30 text-nowrap w-auto items-center px-4 py-1.5 text-left text-sm hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
      /*
                    disabled={item.disabled}
      */
      onClick={() => handleContextAction(item.id)}
      title={menuText.tooltip}
    >
      <span>{menuText.label}</span>
      {showChild && <LuChevronRight/>}
    </div>
  }
  return (
    <div className={groupClass}
         style={{
           top: position.y,
           left: position.x,
         }}>
      {menuItems.map((item, index) => {
        // const menuText = t(item.id, {returnObjects: true}) as I18nHistoryDataItem
        const showDivider = index === 2 || index === 4 || index === 7
        const showChild = item.children && item.children.length > 0

        return (
          <div key={item.id} className={'relative group'}>
            {showDivider && <div className="border-t border-gray-200 my-1"></div>}
            <MenuItem item={item}/>
            {
              showChild &&
                <div className={groupClass + ' group-hover:block hidden left-full top-0 border-l-0 rounded-none '}>
                  {
                    item.children.map(child => {
                      console.log(child)
                      return <MenuItem item={child}/>
                    })
                  }
                </div>
            }
          </div>
        )
      })}
    </div>
  )
}