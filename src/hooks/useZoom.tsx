import {useContext, useEffect} from 'react'
import Zoom from '../lib/zoom/zoom.ts'
import throttle from '../utilities/throttle.ts'
import ZOOM_LEVELS from '../constants/zoomLevels.ts'
import EditorContext from '../contexts/editorContext/EditorContext.tsx'

function useZoom(element: HTMLElement) {
  const {state, dispatch, executeAction} = useContext(EditorContext)

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
      executeAction('world-zoom', {
        zoomTo: true,
        zoomFactor: nextScale.value,
        physicalPoint: p,
      })
    }
  }

  useEffect(() => {
    if (!element) return

    const zoomPlugin = new Zoom({
      dom: element,
      onZoom: throttle(handleZoom, 200),
      onScroll: (x, y) => {
        executeAction('world-shift', {x, y})
      },
    })

    return () => {
      zoomPlugin.destroy()
    }
  }, [element])
}

export default useZoom
