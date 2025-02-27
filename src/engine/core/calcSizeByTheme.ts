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

  for (const key in data) {
    const node = data[key]
    const {width, height} = calcNodeSelfSize(node, ctx)

    newRecord[key] = {
      ...node,
      rect: {
        x: 0,
        y: 0,
        width,
        height,
      }
    }
  }

  ctx.restore()




  return newRecord
}

export default calcSizeByTheme