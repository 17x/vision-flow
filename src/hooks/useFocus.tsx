import {RefObject, useContext, useEffect} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (ref: RefObject<HTMLElement | null>) => {
  const {state: {focused}, dispatch} = useContext(WorkspaceContext)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    const handleMouseEnter = (e: MouseEvent) => {
      const f = ref.current!.contains(e.target as Node)

      if (!focused) {
        dispatch({type: 'SET_FOCUSED', payload: f})
      }
    }

    const handleMouseOut = () => {
      dispatch({type: 'SET_FOCUSED', payload: false})
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseOut)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseOut)
    }
  }, [ref, focused])

}
export default useFocus