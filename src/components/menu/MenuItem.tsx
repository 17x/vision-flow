import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {NestedActions} from "./Menu.tsx";

interface MenuItemProps {
  menu: NestedActions
}

const MenuItem: React.FC<MenuItemProps> = ({
                                             menu,
                                           }) => {
  const {t} = useTranslation()
  const [subOpen, setSubOpen] = useState<boolean>(false);

  const handleClick = () => {
    if (menu.children || subOpen) return

    setSubOpen(true)
  }

  return <div className={'relative h-8 hover:bg-gray-200 '}
              onClick={() => handleClick()}
              onMouseOver={() => setSubOpen(true)}
              onMouseOut={() => setSubOpen(false)}
  >
    <div className="px-4 h-full inline-flex items-center whitespace-nowrap"><span>{t(menu.id + '.label')}</span></div>
    {
      menu.children!.length > 0 && subOpen &&
        <div className={'absolute z-10 left-full top-0 w-auto border border-gray-200 box-border'}>
          {
            menu.children!.map((subItem) => <MenuItem menu={subItem} key={subItem.id}/>)
          }
        </div>}
  </div>
};

export default MenuItem;