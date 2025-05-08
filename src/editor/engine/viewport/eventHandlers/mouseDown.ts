import Editor from '../../editor.ts'

function handleMouseDown(this: Editor, e: MouseEvent) {
  const {clientY, target, button, clientX} = e
  if (!(target === this.viewport.wrapper)) return

  const x = clientX - this.viewport.rect!.x
  const y = clientY - this.viewport.rect!.y

  this.viewport.mouseDownPoint.x = x
  this.viewport.mouseDownPoint.y = y
  this.viewport.mouseMovePoint.x = x
  this.viewport.mouseMovePoint.y = y

  // console.log(operator)
  e.preventDefault()
  if (button !== 0) return

  if (this.viewport.spaceKeyDown) {
    return (this.manipulationStatus = 'panning')
  }

  let tool = this.toolMap.get(this.currentToolName)!

  tool.start.call(this, e)
}

export default handleMouseDown
