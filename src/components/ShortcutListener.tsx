import React, {memo, useContext, useEffect} from 'react'
import {ModuleMoveDirection} from '../engine/editor/type'
import EditorContext from './editorContext/EditorContext.tsx'
import {EditorEventMap, EditorEventType} from '../engine/editor/actions/type'

const ShortcutListener: React.FC = memo(() => {
    const {executeAction, focused} = useContext(EditorContext)

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!focused) return

      let shortcutCode: EditorEventType | null = null
      const {key, ctrlKey, metaKey, shiftKey} = e
      const arrowKeys: { [key: string]: ModuleMoveDirection } = {
        ArrowUp: 'module-move-up',
        ArrowDown: 'module-move-down',
        ArrowLeft: 'module-move-left',
        ArrowRight: 'module-move-right',
      }
      const moveDirection = arrowKeys[key]
      const moveDelta = {x: 0, y: 0}
      const MODULE_MOVE_STEP = 5
      const zoomData: EditorEventMap['world-zoom'] = {
        zoomBy: true,
        zoomFactor: 0.5,
      }
      // console.log(key, metaKey)
      if (key === '=' && (metaKey)) {
        shortcutCode = 'world-zoom'
      }

      if (key === '-' && (metaKey)) {
        shortcutCode = 'world-zoom'
        zoomData.zoomFactor = -0.5
      }

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

        switch (moveDirection) {
          case 'module-move-down':
            moveDelta.y = MODULE_MOVE_STEP
            break
          case 'module-move-up':
            moveDelta.y = -MODULE_MOVE_STEP
            break
          case 'module-move-left':
            moveDelta.x = -MODULE_MOVE_STEP
            break
          case 'module-move-right':
            moveDelta.x = MODULE_MOVE_STEP
            break
        }
      }

      if (!shortcutCode) return

      if (moveDirection) {
        executeAction(shortcutCode, {delta: moveDelta})
      } else if (shortcutCode === 'world-zoom') {
        executeAction(shortcutCode, zoomData)
      } else {
        executeAction(shortcutCode)
      }

      e.stopPropagation()
      e.preventDefault()
    }

    useEffect(() => {
      window.addEventListener('keydown', handleKeyPress)

      return () => {
        window.removeEventListener('keydown', handleKeyPress)
      }
    }, [focused])

    return null
  },
)
export default ShortcutListener