import Editor from '../../editor.ts'

function handleMouseDown(this: Editor, e: MouseEvent) {
  const {shiftKey, clientY, target, button, clientX, metaKey, ctrlKey} = e
  const inViewport = target === this.viewport.wrapper
  const isLeftClick = button === 0
  const modifyKey = ctrlKey || metaKey || shiftKey

  if (!inViewport || !isLeftClick) return

  this.viewport.mouseDownPoint.x = clientX - this.viewport.rect!.x
  this.viewport.mouseDownPoint.y = clientY - this.viewport.rect!.y

  if (this.viewport.spaceKeyDown) {
    this.manipulationStatus = 'panning'
    return
  }

  if (this.hoveredModules.size > 0) {
    const closetId = [...this.hoveredModules][this.hoveredModules.size - 1]

    if (this.isSelectAll) {
      this.moduleMap.forEach(module => {
        this.draggingModules.add(module.id)
      })
    } else {
      if (closetId) {
        if (modifyKey) {
          if (this.selectedModules.has(closetId)) {
            this.draggingModules = new Set(this.selectedModules)
            this.draggingModules.delete(closetId)
          } else {

            this.draggingModules = new Set(this.selectedModules)
            this.draggingModules.add(closetId)

            this.action.dispatch({
              type: 'selection-modify',
              data: {
                mode: 'toggle',
                idSet: new Set([closetId]),
              },
            })

            this.action.dispatch({
              type: 'selection-modify',
              data: {
                mode: 'replace',
                idSet: new Set([closetId]),
              },
            })

          }

        }
      } else {
        console.log(11)
        if (modifyKey) {
          console.log('on blank A')
        } else {
          console.log('on blank No')

        }
      }
    }

    this.manipulationStatus = 'dragging'
    e.preventDefault()
  } else {
    if (!modifyKey) {
      this.action.dispatch({type: 'selection-clear'})
    }

    this.manipulationStatus = 'mousedown'
  }
}

export default handleMouseDown
