import {RefObject, useContext, useEffect, useRef} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (ref: RefObject<HTMLElement | null>) => {
  const {dispatch} = useContext(WorkspaceContext)
  const counterRef = useRef<number>(0)

  const handleMouseMove = (e: MouseEvent) => {

    dispatch({type: 'SET_FOCUSED', payload: ref.current!.contains(e.target?)})
  }

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    element.addEventListener('mousemove', handleMouseMove)
    // element.addEventListener('mouseleave', handleMouseMove)

    return () => {
      counterRef.current = 0
      element.removeEventListener('mousemove', handleMouseMove)
      // element.removeEventListener('mouseleave', handleMouseMove)
    }
  }, [ref])

}
export default useFocus