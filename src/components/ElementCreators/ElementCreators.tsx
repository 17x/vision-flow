import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Col} from '@lite-u/ui'

interface ElementCreators {
  className?: string;
}

const ElementCreators: React.FC<ElementCreators> = ({className = ''}) => {
  const [width, setWidth] = useState<number>(300)
  const isDragging = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none' // Prevent text selection while dragging
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return

    const maxWidth = window.innerWidth * 0.9
    const newWidth = Math.min(Math.max(0, e.clientX), maxWidth)
    e.stopPropagation()
    setWidth(newWidth)
  }, [])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    isDragging.current = false
    document.body.style.cursor = 'default'
    document.body.style.userSelect = ''
    e.stopPropagation()
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return <Col w={50}>

  </Col>
}

export default ElementCreators