import {useEffect} from 'react'
import Zoom from '../lib/zoom/zoom.ts'
import throttle from '../utilities/throttle.ts'

function useZoom(
  params: {
    ref: React.RefObject<HTMLElement | null>,
    onZoom?: (zoomIn: boolean, point: { x: number, y: number }) => void,
    onScroll?: (x: number, y: number) => void
  },
) {
  const {ref, onZoom, onScroll} = params

  useEffect(() => {
    if (!ref.current) return

    const zoomPlugin = new Zoom({
      dom: ref.current,
      onZoom: throttle((zoomIn, event) => {
        onZoom && onZoom(zoomIn, {
          x: event.x,
          y: event.y,
        })
      }, 200),
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
