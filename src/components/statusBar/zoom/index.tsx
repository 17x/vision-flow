import React, {useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AppDispatch, RootState} from "../../../redux/store.ts"
import {setZoom} from "../../../redux/statusBarSlice.ts"
import {LuChevronDown, LuChevronUp} from "react-icons/lu"

export type ZoomLevels = number | 'fit window'

const ZoomSelect: React.FC<unknown> = () => {
  const zoomLevels: ZoomLevels[] = [4, 3, 2, 1.5, 1.25, 1, 0.75, 0.5, 0.25, 'fit window']
  const {zoom} = useSelector((state: RootState) => state.statusBar)
  const dispatch = useDispatch<AppDispatch>()
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBlur = (event: unknown) => {
    calcNewZoomValue(inputRef.current!.value)
    // inputRef.current!.focus();
    inputRef.current!.blur()
    event.preventDefault()
    event.stopPropagation()

  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      calcNewZoomValue(inputRef.current!.value)
      inputRef.current!.blur()
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const calcNewZoomValue = (value: string) => {
    const match = value.match(/\d+/)

    if (match) {
      const v = parseFloat(match[0])

      dispatch(setZoom(v))
      updateInput(v)
    }
  }

  const updateInput = (newValue: number) => {
    inputRef.current!.value = newValue * 100 + '%'
  }
  return (
    <div
      className="w-17 h-5 ml-2 flex justify-start items-center relative  focus:ring-blue-500 focus:ring-1">
      <input
        type="text"
        ref={inputRef}
        defaultValue={zoom as number * 100 + '%'}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        className="w-12 h-5 text-sm bg-gray-100 text-center overflow-hidden "
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
          {zoomLevels.map((level) => (
            <div
              key={level}
              onClick={() => {
                let v = level

                if (v === "fit window") {
                  v = 1
                }

                dispatch(setZoom(v))
                setIsOpen(false)
                updateInput(v)
              }}
              className="text-sm align-middle p-1 text-center hover:bg-blue-500 hover:text-white transition"
            >
              {level === 'fit window' ? level : `${level * 100}%`}
            </div>
          ))
          }
        </div>
      )}
    </div>
  )
}

export default ZoomSelect