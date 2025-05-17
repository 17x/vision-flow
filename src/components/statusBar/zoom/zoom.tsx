import React, {useEffect, useRef, useState} from 'react'
import {LuChevronDown, LuChevronUp} from 'react-icons/lu'
import ZOOM_LEVELS from '../../../constants/zoomLevels.ts'
import {Row, Select, SelectItem} from '@lite-u/ui'

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

  /*<div
    className="w-17 h-5 ml-2 flex justify-start items-center relative  focus:ring-blue-500 focus:ring-1">*/
  return <Row w={20} h={30} ml={5} js center rela>
    <Select onSelectChange={v => {

      setIsOpen(false)
      onChange(v)

    }}>
      {
        ZOOM_LEVELS.map(({label, value}) => <SelectItem key={value} value={value}>{label}</SelectItem>)
      }
    </Select>

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
    {isOpen && <div
        className="absolute w-20 cursor-pointer py-2 left-0 bottom-5 bg-white shadow-lg max-h-40v overflow-y-auto z-10">
      {

      }
      {
        ZOOM_LEVELS.map(({label, value}) => (
          <div
            key={value}
            onClick={() => {
              setIsOpen(false)
              onChange(value)
            }}
            className="text-sm align-middle p-1 text-center hover:bg-blue-500 hover:text-white transition"
          >
            {label}
          </div>
        ))
      }
    </div>}
  </Row>

  // </div>
}

export default ZoomSelect