import {RefObject, useContext, useEffect} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (ref: RefObject<HTMLElement | null>) => {
  const {state: {focused}, dispatch} = useContext(WorkspaceContext)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    const handleMouseMove = (e: MouseEvent) => {
      const f = ref.current!.contains(e.target as Node)

      if (f !== focused) {
        dispatch({type: 'SET_FOCUSED', payload: f})
      }
    }

    element.addEventListener('mousemove', handleMouseMove)
    // element.addEventListener('mouseleave', handleMouseMove)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [ref, focused])

}
export default useFocus