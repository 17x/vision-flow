import {useContext, useEffect, useRef, useState} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'
// import {useTranslation} from "react-i18next";
// import OptimizedDND from "./OptimizedDND.ts";

interface LayerPanelProps {
  data: ModuleInstance[]
  selected: UID[]
}

const ITEM_HEIGHT = 28
export const LayerPanel = ({data, selected}: LayerPanelProps) => {
  // const {t} = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [indexRange, setIndexRange] = useState([0, 10])
  const {executeAction} = useContext(EditorContext)

  useEffect(() => {
    /*  const closestOne = selected[selected.length - 1]

      if (closestOne) {
        const idx = data.findIndex(x => x.id === closestOne)

        scrollRef.current?.scrollTo(0, idx * ITEM_HEIGHT)
        console.log(idx * ITEM_HEIGHT)
      }*/
  }, [selected])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const newScrollTop = scrollRef.current.scrollTop
    const scrollUp = newScrollTop < scrollTop
    const startIndex = Math.round(newScrollTop / ITEM_HEIGHT)
    const endIndex = startIndex + 10

    // console.log(newScrollTop)
    if (scrollUp) {
      if (indexRange[0] >= data.length - 1) return
    } else {
      if (indexRange[1] >= data.length - 1) return

    }

    setScrollTop(newScrollTop)
    setIndexRange([startIndex, endIndex])
  }

  const arr = []

  for (let i = indexRange[0]; i < indexRange[1]; i++) {
    const item = data[i]

    if (item) {
      arr.push(
        <div ref={selected?.includes(item.id) ? targetRef : null}
             style={{height: ITEM_HEIGHT}}
             className={selected?.includes(item.id) ? 'bg-gray-400 text-white' : ''}
             onClick={() => {
               executeAction('selection-modify', {mode: 'replace', idSet: new Set([item.id])})
             }}
             id={`layer-module-${item.id}`}
             key={item.id}>
          {/*{item.id.match(/\d+$/)[0]}*/}
          {item.type}
        </div>,
      )
    }
  }

  return (
    <div className={'p-2'}>
      <h1 className={'bg-gray-400 text-white px-2'}><span>Layer</span></h1>
      <div className={'p-2 relative overflow-hidden'}>
        <div ref={scrollRef}
             onScroll={handleScroll}
             className={'relative scrollbar-custom overflow-x-hidden overflow-y-auto p-2 border h-30 border-gray-200 select-none'}>
          <div className={'absolute w-full top-0 left-0'} style={{
            height: data.length * ITEM_HEIGHT,
          }}></div>
          <div className={'w-full sticky top-0 left-0'}>{arr}</div>
        </div>
      </div>
    </div>
  )
}

