import {RefObject, useCallback, useContext, useEffect} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (ref: RefObject<HTMLElement | null>) => {
  const {state, dispatch, executeAction} = useContext(WorkspaceContext)

  const checkInside = useCallback((e: MouseEvent) => {
    if (element) {
      dispatch({type: 'SET_FOCUSED', payload: element.contains(e.target as Node)})
    }
  }, [])

  const handleFocus = () => {
    dispatch({type: 'SET_FOCUSED', payload: true})
  }

  const handleBlur = () => {
    dispatch({type: 'SET_FOCUSED', payload: false})
  }

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    window.addEventListener('mouseup', checkInside)
    element.addEventListener('focus', handleFocus)
    element.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('mouseup', checkInside)
      element.removeEventListener('focus', handleFocus)
      element.removeEventListener('blur', handleBlur)
    }
  }, [ref])

}
export default useFocus