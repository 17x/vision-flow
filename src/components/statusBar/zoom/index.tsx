import React, {useEffect, useRef, useState} from 'react'
import {LuChevronDown, LuChevronUp} from 'react-icons/lu'

export type ZoomLevels = {
  label: string,
  value: number | 'fit'
}

const fixNumber = (i: number) => {
  return (i * 100).toFixed(2) + '%'
}

const resolveNumber = (value: string): number | false => {
  const str = value.replace('%', '').trim()
  const numeric = Number(str)

  if (!isNaN(numeric)) {
    return Number(numeric.toFixed(2))
  }

  return false
}

const ZoomSelect: React.FC<{ scale: number, onChange: (newScale: number | 'fit') => void }> = ({scale, onChange}) => {
  const zoomLevels: ZoomLevels[] = [
    {label: '64000%', value: 64000},
    {label: '3200%', value: 3200},
    {label: '1600%', value: 1600},
    {label: '800%', value: 800},
    {label: '400%', value: 400},
    {label: '200%', value: 200},
    {label: '150%', value: 150},
    {label: '100%', value: 100},
    {label: '66.67%', value: 66.67},
    {label: '50%', value: 50},
    {label: '33.33%', value: 33.33},
    {label: '25%', value: 25},
    {label: '12.5%', value: 12.5},
    {label: '6.25%', value: 6.25},
    {label: '3.13%', value: 3.13},
    {label: '1.56% (Min)', 'value': 1.56},
    {label: 'Fit window', value: 'fit'},
  ]
  // const {zoom} = useSelector((state: RootState) => state.statusBar)
  // const dispatch = useDispatch<AppDispatch>()
  const [inputValue, setInputValue] = useState<string>(fixNumber(1))
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const v = fixNumber(scale)

    if (inputRef.current) {
      inputRef.current.value = v
    }

    setInputValue(v)
  }, [scale])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const v = resolveNumber((e.target as HTMLInputElement).value)

      if (v !== false) {
        onChange(v)
      }
      inputRef.current!.blur()
    }

    // event.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className="w-17 h-5 ml-2 flex justify-start items-center relative  focus:ring-blue-500 focus:ring-1">
      <input
        type="text"
        ref={inputRef}
        onChange={void 0}
        defaultValue={inputValue}
        onKeyDown={onKeyDown}
        className="w-20 h-5 text-sm bg-gray-100 text-center overflow-hidden "
        placeholder="Enter zoom %"
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-800 flex trasition items-center cursor-pointer"
      >
        {
          isOpen ? <LuChevronUp className="w-5 h-5"/> : <LuChevronDown className="w-5 h-5"/>
        }
      </button>
      {
        isOpen && <div className={'fixed w-full h-full'} onClick={() => {
          setIsOpen(false)
        }}></div>
      }
      {isOpen && (
        <div
          className="absolute w-20 cursor-pointer py-2 left-0 bottom-5 bg-white shadow-lg max-h-40v overflow-y-auto z-10">
          {

          }
          {
            zoomLevels.map(({label, value}) => (
              <div
                key={value}
                onClick={() => {
                  setIsOpen(false)
                  onChange(value)
                }}
                className="text-sm align-middle p-1 text-center hover:bg-blue-500 hover:text-white transition"
              >
                {value === 'fit' ? label : `${value * 100}%`}
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

export default ZoomSelect