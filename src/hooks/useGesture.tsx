import {RefObject, useEffect, useRef} from 'react'
import Zoom from '../lib/zoom/zoom.ts'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'

function useGesture(ref: RefObject<HTMLElement | null>, executeAction: EditorExecutor, currentTool:string, handleZoom) {
  const pluginRef = useRef<Zoom | null>(null)

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
  }, [ref /*currentScale, currentTool*/])
}

export default useGesture
