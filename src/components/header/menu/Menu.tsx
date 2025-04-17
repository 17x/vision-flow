import React, {memo, useEffect, useMemo, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {MenuActionRecord, MenuActionType} from '../../../redux/menuSlice.ts'
import MenuItem from './MenuItem.tsx'
import MenuData from './MenuData.ts'

const MenuBar: React.FC = memo(() => {
  const [open, setOpen] = useState<boolean>(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const {t} = useTranslation()
  const componentRef = useRef<HTMLDivElement>(null)
  // const originActions = useSelector((state: RootState) => state.menu.actions)
  // const actions = useMemo(() => flattenedToNested(originActions), [originActions])
  const actions = MenuData

  useEffect(() => {
    const detectClose = (e: MouseEvent) => {
      if (!componentRef.current!.contains(e.target as Node)) {
        setOpen(false)
        setOpenId(null)
      }
    }

    // console.log(MenuData)

    window.addEventListener('click', detectClose)

    return () => {
      window.removeEventListener('click', detectClose)
    }
  })

  // console.log('menu')
  return <div className="h-8 text-sm select-none border-gray-200 box-border">
    <div ref={componentRef} className={'pl-2 h-full inline-flex'}>
      {
        actions.map((menu) => {
          return <div key={menu.id} className={'relative h-full'}>
            <div className={`h-full inline-flex items-center px-4 ${menu.id === openId ? 'bg-gray-200' : ''}`}
                 onMouseEnter={() => open && setOpenId(menu.id)}
                 onClick={() => {
                   if (openId !== menu.id) {
                     setOpen(true)
                     setOpenId(menu.id)
                   } else {
                     setOpenId(null)
                     setOpen(false)
                   }

                   // setOpen(!open)
                   // setOpenId(menu.id)
                 }}
                 title={t(menu.id + '.tooltip')}
            >
              <span>{t(menu.id + '.label')}</span>
            </div>
            {
              open && menu.id === openId && menu.children!.length > 0 &&
                <div className={'absolute z-20 bg-white border border-gray-200'}>
                  {
                    menu.children?.map((child) => {
                      return <MenuItem key={child.id} menu={child}/>
                    })
                  }</div>
            }
          </div>
        })
      }</div>
  </div>
})

export type NestedActions = {
  children?: NestedActions[]
} & MenuActionType

function flattenedToNested(menuData: MenuActionRecord): NestedActions[] {
  const rootMap: Map<string, NestedActions> = new Map()

  // Build a records for all items
  Object.values(menuData).forEach((item) => {
    rootMap.set(item.id, {...item, children: []})
  })

  // Create the nested structure
  const nestedMenu: NestedActions[] = []

  rootMap.forEach((currentAction) => {

    const parentAction = rootMap.get(currentAction.parent!)
    if (parentAction) {
      // If the item has a parent,
      // add it to the parent's children array
      parentAction.children!.push(currentAction)
    } else {
      // If the item has no parent,
      // it's a top-level item,
      // so add it to the nestedMenu
      nestedMenu.push(currentAction)
    }
  })

  return nestedMenu
}

export default MenuBar
