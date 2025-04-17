import {FC, memo, useContext, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {I18nHistoryDataItem} from '../../i18n/type'
import EditorContext from '../editorContext/EditorContext.tsx'
import {LuChevronRight} from 'react-icons/lu'
import {MenuType} from '../header/menu/type'

export interface ContextMenuProps {
  position: Point
  // onAction: (action: string) => void
  onClose: () => void
}

export const ContextMenu: FC<ContextMenuProps> = memo(({position, onClose}) => {
  const {t} = useTranslation()
  const {selectedModules, copiedItems, executeAction} = useContext(EditorContext)
  const [menuItems, setMenuItems] = useState<MenuType[]>([])
  const groupClass = 'absolute bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50'

  useEffect(() => {
    const noSelectedModule = selectedModules.length === 0
    const ITEMS: MenuType[] = [
      {id: 'copy', disabled: noSelectedModule},
      {id: 'paste', disabled: copiedItems.length === 0},
      {id: 'delete', disabled: noSelectedModule},
      {id: 'duplicate', disabled: noSelectedModule},
      // {id: 'group', disabled: selectedModules.size < 2},
      // {id: 'ungroup', disabled: noSelectedModule},
      // {id: 'lock', disabled: noSelectedModule},
      // {id: 'unlock', disabled: noSelectedModule},
      {
        id: 'layer',
        disabled: noSelectedModule,
        children: [
          {id: 'sendToBack', disabled: noSelectedModule},
          {id: 'bringToFront', disabled: noSelectedModule},
          {id: 'sendBackward', disabled: noSelectedModule},
          {id: 'bringForward', disabled: noSelectedModule},
        ],
      },
    ]
    // console.log(selectedModules)
    setMenuItems(ITEMS)

    const remove = () => {
      onClose()
    }

    window.addEventListener('click', remove)

    return () => {
      window.removeEventListener('click', remove)
    }
  }, [selectedModules, position, copiedItems])

  // console.log(9)
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

  const MenuItem: FC<{ item: MenuType, onMouseUp: VoidFunction }> = ({item, onMouseUp}) => {
    const menuText = t(item.id, {returnObjects: true}) as I18nHistoryDataItem
    const hasChildren = item.children && item.children.length > 0

    return <div className={'min-w-40 relative group'}
                title={menuText.tooltip}>
      <button type={'button'}
              disabled={item.disabled}
              onMouseUp={onMouseUp}
              className={'flex justify-between px-4 text-nowrap items-center py-1.5 w-full text-left text-sm  hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed'}
      >{menuText.label}
        {hasChildren && <LuChevronRight/>}
      </button>

      {
        hasChildren &&
          <div className={groupClass + ' z-60 group-hover:block hidden left-full top-0 border-l-0 rounded-none '}>
            {
              item.children!.map((child, childIndex) => {
                return <MenuItem key={childIndex} item={child} onMouseUp={() => handleContextAction(item.id)}/>
              })
            }
          </div>
      }
    </div>
  }

  return (
    <div className={groupClass}
         onClick={(e) => {
           e.preventDefault()
           e.stopPropagation()
         }}
         style={{
           top: position.y,
           left: position.x,
         }}>

      {
        menuItems.map((item, index) => {
          return <MenuItem key={index} item={item} onMouseUp={() => {
            handleContextAction(item.id)
            onClose()
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
})

