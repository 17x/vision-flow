import Editor from '../../editor.ts'

export default function handlePointerMove(this: Editor, e: PointerEvent) {
  const {
    action,
    viewport,
  } = this
  viewport.mouseMovePoint.x = e.clientX - viewport.rect!.x
  viewport.mouseMovePoint.y = e.clientY - viewport.rect!.y
  viewport.drawCrossLine = false

  action.dispatch('world-mouse-move')
  let tool = this.toolMap.get(this.currentToolName)!

  tool.move.call(this, e)
}
