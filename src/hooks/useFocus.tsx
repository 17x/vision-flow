import {RefObject, useContext, useEffect, useRef} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useFocus = (ref: RefObject<HTMLElement | null>) => {
  const {dispatch} = useContext(WorkspaceContext)
  const counterRef = useRef<number>(0)

  const handleEnter = () => {
    counterRef.current++
    console.log(true)

    if (counterRef.current === 1) {
      console.log(true)
      dispatch({type: 'SET_FOCUSED', payload: true})
    }
  }

  const handleLeave = () => {
    counterRef.current--
    console.log(false)

    if (counterRef.current === 0) {
      console.log(false)
      dispatch({type: 'SET_FOCUSED', payload: false})
    }
  }

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    element.addEventListener('mouseenter', handleEnter)
    element.addEventListener('mouseleave', handleLeave)

    return () => {
      counterRef.current = 0
      element.removeEventListener('mouseover', handleEnter)
      element.removeEventListener('mouseleave', handleLeave)
    }
  }, [ref])

}
export default useFocus