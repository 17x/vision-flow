import React, {useContext, useEffect} from 'react'
import {ActionCode, MoveDirection} from "../engine/editor/type"
import EditorContext from "./editorContext/EditorContext.tsx"

const ShortcutListener: React.FC = () => {
  const {executeAction, focused} = useContext(EditorContext)

  const handleKeyPress = (e: KeyboardEvent) => {
    let shortcutCode: ActionCode | null = null
    const {key, ctrlKey, metaKey, shiftKey} = e

    const arrowKeys: { [key: string]: MoveDirection } = {
      ArrowUp: 'moveUp',
      ArrowDown: 'moveDown',
      ArrowLeft: 'moveLeft',
      ArrowRight: 'moveRight',
    }

    if (key === 'a' && (ctrlKey || metaKey)) {
      shortcutCode = 'selectAll'
    }

    if (key === 'c' && (ctrlKey || metaKey) && !shiftKey) {
      shortcutCode = 'copy'
    }

    if (key === 'v' && (ctrlKey || metaKey)) {
      shortcutCode = 'paste'
    }

    if (key === 'd' && (ctrlKey || metaKey)) {
      shortcutCode = 'duplicate'
    }

    if (key === 'Delete' || key === 'Backspace') {
      shortcutCode = 'delete'
    }

    if (key === 'Escape') {
      shortcutCode = 'escape'
    }

    if (key === 'z' && (ctrlKey || metaKey)) {
      shortcutCode = 'undo'
    }

    if (key === 'z' && shiftKey && (ctrlKey || metaKey)) {
      shortcutCode = 'redo'
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