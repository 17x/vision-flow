import {useCallback, useContext, useEffect} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (element: HTMLElement | null) => {
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
    if (!element) return

    window.addEventListener('mouseup', checkInside)
    element.addEventListener('focus', handleFocus)
    element.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('mouseup', checkInside)
      element.removeEventListener('focus', handleFocus)
      element.removeEventListener('blur', handleBlur)
    }
  }, [element])

}
export default useFocus