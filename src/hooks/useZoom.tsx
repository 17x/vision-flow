import {RefObject, useContext, useEffect, useState} from 'react'
import Zoom from '../lib/zoom/zoom.ts'
import ZOOM_LEVELS from '../constants/zoomLevels.ts'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

function useZoom(ref: RefObject<HTMLElement | null>, currentScale: number, executeAction) {
  const {dispatch} = useContext(WorkspaceContext)
  const [localScale, setLocalScale] = useState(currentScale)

  const handleZoom = (zoomIn: boolean, p: { x: number, y: number }) => {
    let nextScale = null
    let filtered = ZOOM_LEVELS.filter(z => typeof z.value === 'number')

    if (zoomIn) {
      nextScale = filtered.reverse().find(z => z.value > localScale)
    } else {
      nextScale = filtered.find(z => z.value < localScale)
    }

    if (nextScale) {
      dispatch({type: 'SET_WORLD_SCALE', payload: nextScale.value})
      // onScale
      executeAction('world-zoom', {
        zoomTo: true,
        zoomFactor: nextScale.value,
        physicalPoint: p,
      })
    }
  }

  useEffect(() => {
    setLocalScale(currentScale)

    if (!ref.current) return

    const zoomPlugin = new Zoom({
      dom: ref.current,
      onZoom: handleZoom,
      onScroll: (x, y) => {
        executeAction('world-shift', {x, y})
      },
    })

    return () => {
      zoomPlugin.destroy()
    }
  }, [ref, currentScale])
}

export default useZoom
