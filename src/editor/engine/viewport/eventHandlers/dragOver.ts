import Editor from '../../editor.ts'

function handleDragOver(this: Editor, e: DragEvent) {
  e.preventDefault()
}

export default handleDragOver

