import MenuBar from './menu/Menu.tsx'
import ShortcutBar from './shortcutBar/ShortcutBar.tsx'

const Header: React.FC = () => {
  console.log(9)
  return <header>
    <MenuBar/>
    <ShortcutBar/>
  </header>
}
export default Header