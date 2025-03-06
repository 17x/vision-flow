interface PropertyPanelProps {
  className?: string
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({className = ''}) => {
  return (
    <div className={'w-[30%] h-full shadow' + ' ' + className}>
      PropertyPanel
    </div>
  );
};