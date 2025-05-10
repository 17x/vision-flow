import MenuBar from './menu/Menu.tsx'
import ShortcutBar from './shortcutBar/ShortcutBar.tsx'

const Header: React.FC = () => {
  return <header>
    <MenuBar/>
    <ShortcutBar/>
  </header>
}
export default Header