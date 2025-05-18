import {useContext, useEffect, useMemo} from 'react'
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

  useEffect(() => {
    const shortcut1 = new Shortcut({
      shortcuts: data,
      callback: (id: string) => {
        if (focused) {
          const c = data.find(item => item.id === id)
          if (c.editorAction) {
            executeAction(c.editorAction)
          }
        }
      },
    })
    const shortcut2 = new Shortcut({
      shortcuts: data,
      upMode: true,
      callback,
    })
    // }

    return () => {
      shortcut1.destroy()
      shortcut2.destroy()
      // pluginRef.current?.destroy()
      // pluginRef.current = null
    }
  }, [focused])
}

export default useShortcut