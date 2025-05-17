import {useEffect} from 'react'
import Zoom from '../lib/zoom/zoom.ts'

function useZoom(
  params: {
    ref: React.RefObject<HTMLElement | null>,
    onZoom?: (zoomIn: boolean) => void,
    onScroll?: (x: number, y: number) => void
  },
) {
  const {ref, onZoom, onScroll} = params

  useEffect(() => {
    if (!ref.current) return

    const zoomPlugin = new Zoom({
      dom: ref.current,
      onZoom: (zoomIn) => {
        onZoom && onZoom(zoomIn)
      },
      onScroll: (x, y) => {
        onScroll && onScroll(x, y)
      },
    })

    return () => {
      zoomPlugin.destroy()
    }
  }, [params])
}

export default useZoom
