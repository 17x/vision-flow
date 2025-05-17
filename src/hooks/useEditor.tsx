// useEditorInstance.ts
import {RefObject, useContext, useEffect, useRef, useState} from 'react'
import {useUI} from '../contexts/UIContext/UIContext.tsx'
import EditorContext from '../contexts/editorContext/EditorContext.tsx'
import {Editor} from '@lite-u/editor'

// import FileContext from '../contexts/fileContext/FileContext.tsx'

function useEditor(ref: RefObject<HTMLDivElement | null>, workspace, page) {
  const {dpr} = useUI()
  const [sortedModules, setSortedModules] = useState<ElementInstance[]>([])
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0})
  const {state, dispatch, executeAction} = useContext(EditorContext)
  const lastSavedHistoryId = useRef(0)
  const currentHistoryId = useRef(0)
  const needSaveLocal = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const container = ref.current

    const editor = new Editor({
      container,
      elements: workspace.elements,
      assets: workspace.assets,
      config: {
        dpr,
        page,
      },
      events: {
        onInitialized: () => {
          editor.execute('switch-tool', state.currentTool)
        },
        onZoomed: (scale) => {
          dispatch({type: 'SET_WORLD_SCALE', payload: scale})
        },
        onHistoryUpdated: (historyTree) => {
          dispatch({type: 'SET_HISTORY_ARRAY', payload: historyTree!.toArray()})

          if (historyTree.current) {
            const newHistoryStatus = {
              id: historyTree.current.id,
              hasPrev: !!historyTree.current.prev,
              hasNext: !!historyTree.current.next,
            }
            const newNeedSaveValue = newHistoryStatus.id !== lastSavedHistoryId.current
            // console.log(state.historyStatus)

            // console.log(state.needSave)
            // console.log(newHistoryStatus.id, lastSavedHistoryId.current)
            // console.log(newHistoryStatus.id !== lastSavedHistoryId.current)

            currentHistoryId.current = newHistoryStatus.id
            dispatch({type: 'SET_HISTORY_STATUS', payload: newHistoryStatus})
            dispatch({type: 'SET_NEED_SAVE', payload: newNeedSaveValue})
            needSaveLocal.current = newNeedSaveValue
          }
        },
        onModulesUpdated: (moduleMap) => {
          const arr = Array.from(moduleMap.values()).sort((a, b) => a.layer - b.layer)

          console.log(arr)
          setSortedModules(arr)
        },
        onSelectionUpdated: (selected, props) => {
          dispatch({type: 'SET_SELECTED_MODULES', payload: Array.from(selected)})
          dispatch({type: 'SET_SELECTED_PROPS', payload: props})
        },
/*        onViewportUpdated: (viewportInfo) => {
          dispatch({type: 'SET_VIEWPORT', payload: viewportInfo})
        },*/
        onWorldMouseMove: (point) => {
          // dispatch({type: 'SET_WORLD_POINT', payload: point})
          // worldPoint.current = point
         /* if (worldPointRef.current) {
            worldPointRef.current.set(point)
          }*/
        },
        onContextMenu: (position) => {
          setShowContextMenu(true)
          // dispatch({type: 'SET_SHOW_CONTEXT_MENU', payload: viewportInfo})

          setContextMenuPosition(position)
        },
        onModuleCopied: (items) => {
          dispatch({type: 'SET_COPIED_ITEMS', payload: items})
        },
        onSwitchTool: (toolName) => {
          dispatch({type: 'SET_CURRENT_TOOL', payload: toolName})
        },
      },
    })

    return () => editor.destroy()
  }, [ref, workspace])
}

export default useEditor