import MenuBar from "./menu/Menu.tsx"
import Toolbar from "./toolbar/Toolbar.tsx"
import {memo} from 'react'

const Header: React.FC = memo(() => {
  return <header>
    <MenuBar/>
    <Toolbar/>
  </header>
}
)
export default Header