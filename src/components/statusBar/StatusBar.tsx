import ZoomSelect from './zoom'
import {useContext} from 'react'
import EditorContext from '../editorContext/EditorContext.tsx'

interface StatusBarProps {
  worldPoint: Point
  className?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({className = '', worldPoint}) => {
  const {viewport, executeAction} = useContext(EditorContext)
  // console.log(viewport)
  if (!viewport) return null
  // console.log(viewport)
  return (
    <footer className={className + 'w-full h-8 flex justify-between pr-1 items-center border-t border-gray-200'}>
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