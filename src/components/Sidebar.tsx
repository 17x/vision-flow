interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({open}: SidebarProps) => {
  return (
    <div style={{width: open ? '100px' : 0}}>
      sidebar
    </div>
  );
};