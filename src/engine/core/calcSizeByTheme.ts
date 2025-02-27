const calcSizeByTheme = (data: FlattenDataRecord, ctx: CanvasRenderingContext2D, theme: ThemeShape): SizedDataRecord => {
  const newRecord: SizedDataRecord = {}

  ctx.save()
  ctx.font = theme.typography.fontSize + 'px mono sans-serif'

  for (const dataKey in data) {
    const node = data[dataKey];
    const isComplexType = node.type === 'object' || node.type === 'array';
    const metrics = ctx.measureText(isComplexType ? node.type : String(node.value));
    const width = metrics.width;
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const parentId: number = node.parentId ?? -1;
    let x = 0
    let y = 0

    // root
    if (parentId > 0) {
      const parentNode: SizedDataBase = newRecord[parentId]

      x = parentNode.selfSize.x + parentNode.selfSize.width
      y = parentNode.selfSize.y + parentNode.selfSize.height / 2
    }

    newRecord[dataKey] = {
      ...node,
      selfSize: {
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