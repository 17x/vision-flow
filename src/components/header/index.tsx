import MenuBar from "./menu/Menu.tsx";
import Toolbar from "./toolbar/Toolbar.tsx";
import Files from "./files";

const Header: React.FC = () => {
  return <header>
    <Files/>
    <MenuBar/>
    <Toolbar/>
  </header>
};

export default Header