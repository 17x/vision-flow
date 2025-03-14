import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import editorActions from "../../actions";
import {useSelector} from "react-redux";

type MenuItem = {
  id: string;
  shortcut?: string;
  children?: MenuItem[];
};

const MenuBar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const {t} = useTranslation()
  const componentRef = useRef<HTMLDivElement>(null); // Create a reference to the component
  const actions = useSelector((state: any) => state.editorActions.actions);

  useEffect(() => {
    const detectClose = (e: MouseEvent) => {
      if (!componentRef.current!.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("click", detectClose);

    return () => {
      window.removeEventListener("click", detectClose);
    }
  })
  return (
    <div className="h-10 py-2">
      <div ref={componentRef} className={'flex space-x-4'}>
        {
          actions.map((menu) => (
            <div key={menu.id} className={'relative'}>
              <div onMouseEnter={() => open && setOpenId(menu.id)}
                   onClick={() => {
                     setOpen(!open)
                     setOpenId(menu.id)
                   }}>{t(menu.id)}</div>
              <div className={'absolute z-20'}>{
                open && menu.id === openId &&
                menu.children?.map((child: MenuItem) => {
                  return <MenuItem menu={child}/>
                })
              }</div>
            </div>
          ))
        }</div>
    </div>
  );
};

interface MenuItemProps {
  menu: MenuItem
}

const MenuItem: React.FC<MenuItemProps> = ({
                                             menu,
                                           }) => {
  const {t} = useTranslation()
  const [subOpen, setSubOpen] = useState<boolean>(false);

  const handleClick = () => {
    if (menu.children) return

    if (subOpen) return

    setSubOpen(true)
  }

  const handleMouseEnter = () => {
    setSubOpen(true)
  }

  const handleMouseOut = () => {
    setSubOpen(false)
  }

  return (<div className={'relative'}
               onClick={() => handleClick()}
               onMouseOver={() => handleMouseEnter()}
               onMouseOut={() => handleMouseOut()}
    >
      <div className="flex space-x-4 p-2 relative"
      >{t(menu.id)}</div>
      {
        menu.children && subOpen &&
          <div className={'absolute z-10 left-0 top-0 w-full h-full bg-amber-50'}>
            {
              menu.children.map((subItem) => (
                <MenuItem menu={subItem} key={subItem.id}/>
              ))
            }
          </div>}
    </div>
  )
    ;
};

export default MenuBar;
