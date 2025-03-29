interface ThemeSelectInterface {
  list: ThemeSpecKey[];
  onChange: (k: ThemeSpecKey) => void;
}

export const ThemeSelect: React.FC<ThemeSelectInterface> = ({list, onChange}) => {
  return (
    <label>
      <span>Theme:</span>
      <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as ThemeSpecKey)}>
        <optgroup label={'Select Your Theme'} />
        {
          list.map((n, i) => {
            return <option key={i} value={n}>{n}</option>
          })
        }
      </select></label>
  )
}
