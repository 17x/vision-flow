import {useContext, useEffect, useMemo, useRef} from 'react'
import {EditorExecutor} from '../components/workspace/Workspace.tsx'
import SHORTCUTS_DATA from '../constants/actions.ts'
import Shortcut from '../lib/shortcut/shortcut.ts'
import matchObject from '../utilities/find.ts'
import deepClone from '../utilities/deepClone.ts'
import WorkspaceContext from '../contexts/workspaceContext/WorkspaceContext.tsx'

const useShortcut = (executeAction: EditorExecutor) => {
  const {state: {focused}} = useContext(WorkspaceContext)

  const data = useMemo(() => matchObject(deepClone(SHORTCUTS_DATA), (item) => !!item.shortcut) as {
    id: string,
    shortcut: string
  }[], [])

  const pluginRef = useRef<Shortcut | null>(null)

  useEffect(() => {
    if (!pluginRef.current) {
      const callback = (id: string) => {
        console.log('focused', focused)

        if (focused) {
          // console.log(data)
          const c = data.find(item => item.id === id)
          console.log(c)
          if (c.editorAction) {
            executeAction(c.editorAction)
          }
        }
      }

      pluginRef.current = new Shortcut({
        shortcuts: data,
        callback,
      })
    }

    return () => {
      pluginRef.current?.destroy()
      pluginRef.current = null
    }
  }, [focused])
}

export default useShortcut