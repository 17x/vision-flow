import Toolbar from "./Toolbar.tsx";

interface MenuProps {
  className?: string
}

export const Menu: React.FC<MenuProps> = ({className = ''}) => {
  return (
    <header className={' ' + className}>
      <Toolbar />
    </header>
  );
};