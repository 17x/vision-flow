interface ModulePanelProps {
  className?: string
}

export const ModulePanel: React.FC<ModulePanelProps> = ({className = ''}) => {
  return (
    <div className={'w-[30%] h-full shadow' + ' ' + className}>
      ModulePanel
    </div>
  );
};