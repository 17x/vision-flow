import {RefObject, useContext, useEffect, useRef} from 'react'
import Zoom from '../lib/zoom/zoom.ts'
import ZOOM_LEVELS from '../constants/zoomLevels.ts'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'

function useGesture(ref: RefObject<HTMLElement | null>, executeAction: EditorExecutor, currentScale: number, currentTool: ToolName) {
  const {dispatch} = useContext(WorkspaceContext)
  const pluginRef = useRef<Zoom | null>(null)
  const handleZoom = (zoomIn: boolean, p: { x: number, y: number }) => {
    let nextScale = null
    let filtered = ZOOM_LEVELS.filter(z => typeof z.value === 'number')

    if (zoomIn) {
      nextScale = filtered.reverse().find(z => z.value > currentScale)
    } else {
      nextScale = filtered.find(z => z.value < currentScale)
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

    if (!pluginRef.current) {
      pluginRef.current = new Zoom({
        dom: ref.current,
        onZoom: handleZoom,
        onScroll: (x, y) => {
          executeAction('world-shift', {x, y})
        },
      })
    }

    const handleClick = (e: MouseEvent) => {
      if (currentTool === 'zoomIn' || currentTool === 'zoomOut') {
        handleZoom(currentTool === 'zoomIn', e)
      }
    }

    ref.current.addEventListener('click', handleClick)

    return () => {
      ref.current?.removeEventListener('click', handleClick)
      pluginRef.current?.destroy()
      pluginRef.current = null
    }
  }, [ref, currentScale, currentTool])
}

export default useGesture
