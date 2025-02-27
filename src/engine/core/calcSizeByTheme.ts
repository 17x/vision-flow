const calcNodeSelfSize = (node: FlattenDataBase, ctx: CanvasRenderingContext2D): SizeBase => {
  const isComplexType = node.type === 'object' || node.type === 'array';
  const metrics = ctx.measureText(isComplexType ? node.type : String(node.value));
  const width = metrics.width;
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  return {
    width, height
  }
}

const calcSizeByTheme = (data: FlattenDataRecord, ctx: CanvasRenderingContext2D, theme: ThemeShape): SizedDataRecord => {
  const newRecord: SizedDataRecord = {}
  const maxWidth = ctx.canvas.width
  const maxHeight = ctx.canvas.height
  const startPoint: PositionBase = {
    x: 0,
    y: maxHeight / 2
  }

  ctx.save()
  ctx.font = theme.typography.fontSize + 'px mono sans-serif'

  for (const dataKey in data) {
    const node = data[dataKey];
    const parentId: number = node.parentId ?? -1;
    const {width, height} = calcNodeSelfSize(node, ctx)
    let x = 0
    let y = 0

    // root
    if (parentId > 0) {
      const parentNode: SizedDataBase = newRecord[parentId]

      x = parentNode.rect.x + parentNode.rect.width
      y = parentNode.rect.y + parentNode.rect.height / 2
    }

    newRecord[dataKey] = {
      ...node,
      rect: {
        x,
        y,
        width,
        height,
      }
    }
  }

  ctx.restore()

  return newRecord
}

export default calcSizeByTheme