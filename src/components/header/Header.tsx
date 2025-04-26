import MenuBar from './menu/Menu.tsx'
import Toolbar from './toolbar/Toolbar.tsx'

const Header: React.FC = () => {
  return <header>
    <MenuBar/>
    <Toolbar/>
  </header>
}
export default Header