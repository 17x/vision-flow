import {RefObject, useContext, useEffect, useRef} from 'react'
import Zoom from '../lib/zoom/zoom.ts'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'
import {ToolName} from '@lite-u/editor/types'

function useGesture(ref: RefObject<HTMLElement | null>, executeAction: EditorExecutor, currentTool: ToolName, handleZoom) {
  const {dispatch} = useContext(WorkspaceContext)
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
      // handleZoom(e)
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
  }, [ref, currentTool])
}

export default useGesture
