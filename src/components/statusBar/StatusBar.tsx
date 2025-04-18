import ZoomSelect from './zoom'
import {FC, Ref, useContext, useImperativeHandle, useState} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'

export interface PointRef {
  set: (point: Point) => void;
}

type PointRefType = Ref<PointRef>

export const StatusBar: FC<{ ref: PointRefType | null }> = ({ref}) => {
  const {state: {viewport}, executeAction} = useContext(EditorContext)
  const [worldPoint, setWorldPoint] = useState({x: 0, y: 0})

  useImperativeHandle(ref, () => {
    return {
      set(point: Point) {
        setWorldPoint(point)
        // worldPoint.current = point
      },
    }
  }, [])

  if (!viewport) return null

  return (
    <footer className={'w-full h-8 flex justify-between pr-1 items-center border-t border-gray-200'}>
      {
        viewport &&
          <>
              <ZoomSelect key={viewport.scale} scale={viewport.scale} onChange={(newScale) => {
                if (newScale === 'fit') {
                  executeAction('world-zoom', 'fit')
                } else {
                  executeAction('world-zoom', {
                    zoomTo: true,
                    zoomFactor: newScale,
                  })
                }
              }}/>
              <div
                  className={'text-xs line-clamp-1'}>{`dx:${worldPoint.x.toFixed(2)} dy:${worldPoint.y.toFixed(2)}`}</div>
          </>
      }
    </footer>
  )
}