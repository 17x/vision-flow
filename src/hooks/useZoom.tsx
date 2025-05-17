import {RefObject, useContext, useEffect} from 'react'
import Zoom from '../lib/zoom/zoom.ts'
import throttle from '../utilities/throttle.ts'
import ZOOM_LEVELS from '../constants/zoomLevels.ts'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

function useZoom(ref: RefObject<HTMLElement | null>, executeAction) {
  const {state, dispatch} = useContext(WorkspaceContext)

  const handleZoom = (zoomIn: boolean, p: { x: number, y: number }) => {
    const curr = state.worldScale
    let nextScale = null
    let filtered = ZOOM_LEVELS.filter(z => typeof z.value === 'number')

    if (zoomIn) {
      nextScale = filtered.reverse().find(z => z.value > curr)
    } else {
      nextScale = filtered.find(z => z.value < curr)
    }

    if (nextScale) {
      dispatch({type: 'SET_WORLD_SCALE', payload: nextScale.value})
      executeAction('world-zoom', {
        zoomTo: true,
        zoomFactor: nextScale.value,
        physicalPoint: p,
      })
    }
  }

  useEffect(() => {
    if (!ref.current) return

    const zoomPlugin = new Zoom({
      dom: ref.current,
      onZoom: throttle(handleZoom, 17),
      onScroll: (x, y) => {
        executeAction('world-shift', {x, y})
      },
    })

    return () => {
      zoomPlugin.destroy()
    }
  }, [ref])
}

export default useZoom
