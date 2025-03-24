import ZoomSelect from "./zoom";

interface StatusBarProps {
  className?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({className = ''}) => {
  return (
    <footer className={className + 'w-full h-8 flex items-center border-t border-gray-200'}>
      <ZoomSelect/>
    </footer>
  );
};