const calcNodeSelfSize = (node: FlattenDataBase, ctx: CanvasRenderingContext2D): SizeBase => {
  const isComplexType = node.type === 'object' || node.type === 'array';
  const metrics = ctx.measureText(isComplexType ? node.keyName as string : String(node.value));
  const width = metrics.width;
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  return {
    width, height
  }
}

const calcSizeByTheme = (data: FlattenDataRecord, ctx: CanvasRenderingContext2D, theme: ThemeShape): SizedDataRecord => {
  const newRecord: SizedDataRecord = {}
  // const maxWidth = ctx.canvas.width
  const maxHeight = ctx.canvas.height
  const firstPoint: PositionBase = {
    x: 0,
    y: maxHeight / 2
  }

  ctx.save()
  ctx.font = theme.typography.fontSize + 'px mono sans-serif'

  const calcNodeRect = (node: FlattenDataBase, startPoint: PositionBase): SizedDataBase => {
    const {width, height} = calcNodeSelfSize(node, ctx)
    const selfRect: Rect = {
      x: startPoint.x,
      y: startPoint.y,
      width,
      height,
    }
    const rect: Rect = {...selfRect}
    const newNode: SizedDataBase = {
      ...node,
      selfRect,
      rect,
    }
    let maxWidth: number = width
    let maxHeight: number = height
    let _height = 0

    newRecord[node.id] = newNode

    node.children.map(childId => {
      const childNode = calcNodeRect(data[childId], {x: rect.x + rect.width, y: rect.y + _height})

      maxWidth = Math.max(maxWidth, rect.height)
      _height += rect.height
      console.log(childNode)
    })

    maxHeight = Math.max(maxHeight, _height)
    newNode.rect.height = maxHeight

    return newNode
  }

  calcNodeRect(data[0], firstPoint)

  // console.log(newRecord)
  ctx.restore()

  return newRecord
}

export default calcSizeByTheme