interface HistoryPanelProps {
  history: unknown[]
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({history}) => {

  return (
    <div className={'flex flex-wrap space-x-2 space-y-2'}>
      {
        history.map((history, index) => (
          <div>

          </div>
        ))
      }
    </div>
  );
};