import ZoomSelect from './zoom/zoom.tsx'
import {FC, Ref, useContext, useImperativeHandle, useState} from 'react'
import EditorContext from '../../contexts/editorContext/EditorContext.tsx'
import {Row} from '@lite-u/ui'

export interface PointRef {
  set: (point: Point) => void;
}

type PointRefType = Ref<PointRef>

export const StatusBar: FC<{ ref: PointRefType | null }> = ({ref}) => {
  const {state: {worldScale}, executeAction} = useContext(EditorContext)
  const [worldPoint, setWorldPoint] = useState({x: 0, y: 0})

  useImperativeHandle(ref, () => {
    return {
      set(point: Point) {
        setWorldPoint(point)
      },
    }
  }, [])

  return <Row between center fw h={10}>
    {
      viewport &&
        <>
            <ZoomSelect  scale={worldScale} onChange={(newScale) => {
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
  </Row>
  {/*
    <footer className={'w-full h-8 flex justify-between pr-1 items-center border-t border-gray-200'}>

    </footer>*/
  }

}