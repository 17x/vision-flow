import Editor from '../../editor.ts'

function handleMouseUp(this: Editor, e: MouseEvent) {
  let tool = this.toolMap.get(this.currentToolName)!

  tool.finish.call(this, e)
}

export default handleMouseUp
