import {RefObject, useCallback, useContext, useEffect} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (ref: RefObject<HTMLElement | null>) => {
  const {dispatch} = useContext(WorkspaceContext)

  const checkInside = useCallback((e: MouseEvent) => {
    if (ref.current) {
      dispatch({type: 'SET_FOCUSED', payload: ref.current.contains(e.target as Node)})
    }
  }, [])

  const handleFocus = useCallback(() => {
    console.log('Focus')
    dispatch({type: 'SET_FOCUSED', payload: true})
  }, [])

  const handleBlur = useCallback(() => {
    console.log('eBlur')
    dispatch({type: 'SET_FOCUSED', payload: false})
  }, [])

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    window.addEventListener('mouseup', checkInside)
    element.addEventListener('mouseover', handleFocus)
    element.addEventListener('mouseleave', handleBlur)
    // element.addEventListener('focus', handleFocus)
    // element.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('mouseup', checkInside)
      element.removeEventListener('mouseover', handleFocus)
      element.removeEventListener('mouseleave', handleBlur)
      // element.removeEventListener('focus', handleFocus)
      // element.removeEventListener('blur', handleBlur)
    }
  }, [ref])

}
export default useFocus