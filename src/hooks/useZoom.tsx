import {RefObject, useEffect} from 'react'
import Zoom from '../lib/zoom/zoom.ts'

function useZoom(
  ref: RefObject<HTMLElement | null>,
  onZoom?: (zoomIn: boolean) => void,
  onScroll?: (x: number, y: number) => void,
) {
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
  }, [ref, onZoom, onScroll])
}

export default useZoom
