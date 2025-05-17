import ZoomSelect from './ZoomSelect.tsx'
import {FC, Ref, useContext, useImperativeHandle, useState} from 'react'
import WorkspaceContext from '../../contexts/workspaceContext/WorkspaceContext.tsx'
import {Row} from '@lite-u/ui'

export interface PointRef {
  set: (point: Point) => void
}

type PointRefType = Ref<PointRef>

export const StatusBar: FC<{ ref: PointRefType | null }> = ({ref}) => {
  const {state: {worldScale}, executeAction} = useContext(WorkspaceContext)
  const [worldPoint, setWorldPoint] = useState({x: 0, y: 0})

  useImperativeHandle(ref, () => {
    return {
      set(point: Point) {
        setWorldPoint(point)
      }
    }
  }, [])
  return <Row between center fw h={30} style={{borderTop: '1px solid #dfdfdf'}}>
    <ZoomSelect scale={worldScale} onChange={(newScale) => {
      if (newScale === 'fit') {
        executeAction('world-zoom', 'fit')
      } else {
        executeAction('world-zoom', {
          zoomTo: true,
          zoomFactor: newScale,
        })
      }
    }}/>
    <div className={'text-xs line-clamp-1'}>{`dx:${worldPoint.x.toFixed(2)} dy:${worldPoint.y.toFixed(2)}`}</div>
  </Row>
}