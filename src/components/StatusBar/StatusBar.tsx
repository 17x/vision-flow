interface StatusBarProps {
  className?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({className = ''}) => {
  return (
    <footer style={{
      boxShadow: '0 -2px 1px 0px #a9a9a9'
    }} className={className + ' w-full h-10 '}>
      StatusBar
    </footer>
  );
};