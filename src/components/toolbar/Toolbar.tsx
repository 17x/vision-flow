import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/ store.ts";
import {closeMenu, toggleMenu} from "../../redux/menuSlice.ts";

const menuItems = {
  File: ["New", "Open", "Save", "Exit"],
  Edit: ["Undo", "Redo", "Cut", "Copy", "Paste"],
  View: ["Zoom In", "Zoom Out", "Full Screen"]
};

const Toolbar = () => {
  const dispatch = useDispatch();
  const openMenu = useSelector((state: RootState) => state.menu.openMenu);

  return (
    <nav className="menu-bar" onClick={() => dispatch(closeMenu())}>
      {Object.keys(menuItems).map((menu) => (
        <div key={menu} className="menu-item" onClick={(e) => {
          e.stopPropagation(); // Prevent closing immediately
          dispatch(toggleMenu(menu));
        }}>
          <button>{menu}</button>
          {openMenu === menu && (
            <ul className="dropdown">
              {menuItems[menu].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Toolbar;