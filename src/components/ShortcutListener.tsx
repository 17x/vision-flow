import React, {useContext, useEffect} from 'react';
import {EditorContext} from "./EditorContext.tsx";
import {ActionCode, MoveDirection} from "../engine/editor/editor";

const ShortcutListener: React.FC = () => {
  const {executeAction} = useContext(EditorContext)

  const handleKeyPress = (e: KeyboardEvent) => {
    let shortcutCode: ActionCode | null = null;
    const {key, ctrlKey, metaKey, shiftKey} = e

    const arrowKeys: { [key: string]: MoveDirection } = {
      ArrowUp: 'moveUp',
      ArrowDown: 'moveDown',
      ArrowLeft: 'moveLeft',
      ArrowRight: 'moveRight',
    }

    if (key === 'a' && (ctrlKey || metaKey)) {
      shortcutCode = 'select-all'
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
  };

  useEffect(() => {
    // Add keydown event listener to watch for keyboard shortcuts
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return null; // No UI, just functionality
};


export default ShortcutListener;