import {RefObject, useContext, useEffect, useRef} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (ref: RefObject<HTMLElement | null>) => {
  const {dispatch} = useContext(WorkspaceContext)
  const counterRef = useRef<number>(0)
  /*
    const checkInside = useCallback((e: MouseEvent) => {
      if (ref.current) {
        dispatch({type: 'SET_FOCUSED', payload: ref.current.contains(e.target as Node)})
      }
    }, [])*/

  const handleEnter = () => {
    counterRef.current++

    if (counterRef.current === 1) {
      console.log('enter')
      dispatch({type: 'SET_FOCUSED', payload: true})
    }
  }

  const handleLeave = () => {
    counterRef.current--
    if (counterRef.current === 0) {
      console.log('Leave')
      dispatch({type: 'SET_FOCUSED', payload: false})
    }
  }

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    // window.addEventListener('mouseup', checkInside)
    element.addEventListener('mouseenter', handleEnter)
    element.addEventListener('mouseleave', handleLeave)
    // element.addEventListener('focus', handleFocus)
    // element.addEventListener('blur', handleBlur)

    return () => {
      // window.removeEventListener('mouseup', checkInside)
      element.removeEventListener('mouseover', handleEnter)
      element.removeEventListener('mouseleave', handleLeave)
      // element.removeEventListener('focus', handleFocus)
      // element.removeEventListener('blur', handleBlur)
    }
  }, [ref])

}
export default useFocus