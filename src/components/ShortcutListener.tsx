import React, {useContext, useEffect} from 'react'
import {ModuleOperationType, ModuleMoveDirection} from '../engine/editor/type'
import EditorContext from './editorContext/EditorContext.tsx'

const ShortcutListener: React.FC = () => {
  const {executeAction, focused} = useContext(EditorContext)

  const handleKeyPress = (e: KeyboardEvent) => {
    let shortcutCode: ModuleOperationType | null = null
    const {key, ctrlKey, metaKey, shiftKey} = e

    const arrowKeys: { [key: string]: ModuleMoveDirection } = {
      ArrowUp: 'module-move-up',
      ArrowDown: 'module-move-down',
      ArrowLeft: 'module-move-left',
      ArrowRight: 'module-move-right',
    }

    if (key === 'a' && (ctrlKey || metaKey)) {
      shortcutCode = 'select-all'
    }

    if (key === 'c' && (ctrlKey || metaKey) && !shiftKey) {
      shortcutCode = 'selection-copy'
    }

    if (key === 'v' && (ctrlKey || metaKey)) {
      shortcutCode = 'selection-paste'
    }

    if (key === 'd' && (ctrlKey || metaKey)) {
      shortcutCode = 'selection-duplicate'
    }

    if (key === 'Delete' || key === 'Backspace') {
      shortcutCode = 'selection-delete'
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

    if (arrowKeys[key]) {
      shortcutCode = arrowKeys[key]
    }

    if (!shortcutCode) return

    executeAction(shortcutCode)
    e.stopPropagation()
    e.preventDefault()
  }

  useEffect(() => {
    if (!focused) return

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [focused])

  return null
}

export default ShortcutListener