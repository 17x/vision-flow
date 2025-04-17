import {FC, useContext, useEffect, useState} from 'react'
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
  const [menuItems, setMenuItems] = useState([])
  const groupClass = 'absolute bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50'

  useEffect(() => {
    const ITEMS = [
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
    console.log(idSet)
    setMenuItems(ITEMS)

    const remove = () => {
      onClose()
    }

    window.addEventListener('click', remove)

    return () => {
      window.removeEventListener('click', remove)
    }
  }, [idSet, position, copiedItems])

  console.log(9)
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

  const MenuItem: FC<{ item: never, onClick: VoidFunction }> = ({item, onClick}) => {
    const menuText = t(item.id, {returnObjects: true}) as I18nHistoryDataItem
    const hasChildren = item.children && item.children.length > 0
    // console.log(item)
    return <div className={`flex justify-between min-w-30 text-nowrap items-center `}
                title={menuText.tooltip}>
      <button type={'button'}
              disabled={item.disabled}
              onClick={onClick}
              className={'px-4 py-1.5 block w-full text-left text-sm  hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed'}
      >{menuText.label}</button>
      {hasChildren && <LuChevronRight/>}
    </div>
  }

  return (
    <div className={groupClass}
         style={{
           top: position.y,
           left: position.x,
         }}>
      {
        menuItems.map((item, index) => {
          return <MenuItem key={index} item={item} onClick={() => {
            console.log('item')
          }}/>

          /*const showDivider = index === 2 || index === 4 || index === 7
          const showChild = item.children && item.children.length > 0

          return <div key={item.id} className={'relative group'}>
            {showDivider && <div className="border-t border-gray-200 my-1"></div>}
            <MenuItem item={item} onClick={() => {
              // if (hasChildren) return
              handleContextAction(item.id)
            }}/>
            {
              showChild && <div
                    className={groupClass + ' z-60 group-hover:block hidden left-full top-0 border-l-0 rounded-none '}>
                {
                  item.children.map((child, childIndex) => {
                    return <MenuItem key={childIndex} item={child} onClick={() => handleContextAction(item.id)}/>
                  })
                }
                </div>
            }
          </div>*/
        })
      }
    </div>
  )
}