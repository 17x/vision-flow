export interface LineRenderProps {
  startX: number
  startY: number
  endX: number
  endY: number
  fillStyle: string
  // strokeStyle: string
  lineWidth: number
}

const lineRender = (ctx: CanvasRenderingContext2D, rects: LineRenderProps[]): void => {
  const lineQueue: Set<string> = new Set()
  const separateChar = ','
  ctx.save()

  rects.forEach((props) => {
    const s = Object.values(props).join(separateChar)

    lineQueue.add(s)
  })

  let lastLineWidth = NaN
  // let lastStrokeStyle = ''
  let lastFillStyle = ''
  const path = new Path2D()

  lineQueue.forEach((s) => {
      const arr = s.split(separateChar)
      const x0: LineRenderProps['startX'] = parseFloat(arr[0])
      const y0: LineRenderProps['startY'] = parseFloat(arr[1])
      const x1: LineRenderProps['endX'] = parseFloat(arr[2])
      const y1: LineRenderProps['endY'] = parseFloat(arr[3])
      const fillStyle = arr[4]
      const lineWidth = parseFloat(arr[5])

      if (lineWidth !== lastLineWidth) {
        ctx.lineWidth = lineWidth
        lastLineWidth = lineWidth
      }

      if (fillStyle !== lastFillStyle) {
        ctx.fillStyle = fillStyle
        lastFillStyle = fillStyle
      }

      path.moveTo(x0, y0)
      path.lineTo(x1, y1)

    }
  )

  ctx.stroke(path)

  ctx.restore()
}

export default lineRender

