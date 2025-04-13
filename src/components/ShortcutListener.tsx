import React, {useContext, useEffect} from 'react'
import { ModuleMoveDirection} from '../engine/editor/type'
import EditorContext from './editorContext/EditorContext.tsx'
import {EditorEventType} from '../engine/editor/actions/type'

const ShortcutListener: React.FC = () => {
  const {executeAction, focused} = useContext(EditorContext)

  const handleKeyPress = (e: KeyboardEvent) => {
    let shortcutCode: EditorEventType | null = null
    const {key, ctrlKey, metaKey, shiftKey} = e

    const arrowKeys: { [key: string]: ModuleMoveDirection } = {
      ArrowUp: 'module-move-up',
      ArrowDown: 'module-move-down',
      ArrowLeft: 'module-move-left',
      ArrowRight: 'module-move-right',
    }
    const moveDirection = arrowKeys[key]

    if (key === 'a' && (ctrlKey || metaKey)) {
      shortcutCode = 'selection-all'
    }

    if (key === 'c' && (ctrlKey || metaKey) && !shiftKey) {
      shortcutCode = 'module-copy'
    }

    if (key === 'v' && (ctrlKey || metaKey)) {
      shortcutCode = 'module-paste'
    }

    if (key === 'd' && (ctrlKey || metaKey)) {
      shortcutCode = 'module-duplicate'
    }

    if (key === 'Delete' || key === 'Backspace') {
      shortcutCode = 'module-delete'
    }

    if (key === 'Escape') {
      shortcutCode = 'selection-clear'
    }

    if (key === 'z' && (ctrlKey || metaKey)) {
      shortcutCode = 'history-undo'
    }

    if (key === 'z' && shiftKey && (ctrlKey || metaKey)) {
      shortcutCode = 'history-redo'
    }

    if (moveDirection) {
      // shortcutCode = arrowKeys[key]
      shortcutCode = 'module-move'
    }

    if (!shortcutCode) return

    if (moveDirection) {
      executeAction(shortcutCode, {direction: moveDirection})
    } else {
      executeAction(shortcutCode)
    }
    e.stopPropagation()
    e.preventDefault()
  }

  useEffect(() => {
    // if (!focused) return

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [focused])

  return null
}

export default ShortcutListener