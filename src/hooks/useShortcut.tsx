import {useContext, useEffect, useRef} from 'react'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'
import {ModuleMoveDirection, VisionEventMap, VisionEventType} from '@lite-u/editor/types'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'
import SHORTCUTS_DATA from '../constants/shortcuts.ts'
import Shortcut from '../lib/shortcut/shortcut.ts'

const useShortcut = (executeAction: EditorExecutor) => {
  const {state: {focused}} = useContext(WorkspaceContext)
  const pluginRef = useRef<Shortcut | null>(null)

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!focused) return
    let shortcutCode: VisionEventType | null = null
    const {key, ctrlKey, metaKey, shiftKey} = e
    const arrowKeys: { [key: string]: ModuleMoveDirection } = {
      ArrowUp: 'element-move-up',
      ArrowDown: 'element-move-down',
      ArrowLeft: 'element-move-left',
      ArrowRight: 'element-move-right',
    }
    const moveDirection = arrowKeys[key]
    const moveDelta = {x: 0, y: 0}
    const MODULE_MOVE_STEP = 5
    const zoomData: VisionEventMap['world-zoom'] = {
      zoomBy: true,
      zoomFactor: 0.1,
    }
    // console.log(key, metaKey)
    if (key === '=' && metaKey) {
      shortcutCode = 'world-zoom'
    }

    if (key === '-' && metaKey) {
      shortcutCode = 'world-zoom'
      zoomData.zoomFactor = -0.1
    }

    if (key.toLowerCase() === 'w' && (ctrlKey || metaKey)) {
      shortcutCode = 'closeFile'

      window.confirm('000')
      alert(9)
      e.preventDefault()
      e.stopPropagation()
      return false

    }

    if (key === 's' && (ctrlKey || metaKey)) {
      shortcutCode = 'saveFile'
    }

    if (key === 'a' && (ctrlKey || metaKey)) {
      shortcutCode = 'selection-all'
    }

    if (key === 'c' && (ctrlKey || metaKey) && !shiftKey) {
      shortcutCode = 'element-copy'
    }

    if (key === 'v' && (ctrlKey || metaKey)) {
      shortcutCode = 'element-paste'
    }

    if (key === 'd' && (ctrlKey || metaKey)) {
      shortcutCode = 'element-duplicate'
    }

    if (key === 'Delete' || key === 'Backspace') {
      shortcutCode = 'element-delete'
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
      shortcutCode = 'element-move'

      switch (moveDirection) {
        case 'element-move-down':
          moveDelta.y = MODULE_MOVE_STEP
          break
        case 'element-move-up':
          moveDelta.y = -MODULE_MOVE_STEP
          break
        case 'element-move-left':
          moveDelta.x = -MODULE_MOVE_STEP
          break
        case 'element-move-right':
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

  const handleShortcut = (e: KeyboardEvent) => {
    SHORTCUTS_DATA
  }

  useEffect(() => {
    if (!pluginRef.current) {
      pluginRef.current = new Shortcut({
        shortcuts: SHORTCUTS_DATA,
        callback: (code) => {
          console.log(focused)
          console.log(code)
        },
      })
    }

    return () => {
      pluginRef.current?.destroy()
      pluginRef.current = null
    }
  }, [])
}

export default useShortcut