interface PropertyPanelProps {
  className?: string
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({className = ''}) => {
  return (
    <div className={'w-[30%] h-full border-l border-gray-200' + ' ' + className}>
       
    </div>
  )
}