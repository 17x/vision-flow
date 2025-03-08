interface StatusBarProps {
  className?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({className = ''}) => {
  return (
    <footer className={className + ' w-full h-10 border-t border-gray-200'}>
      <div className="text-center"> </div>
    </footer>
  );
};