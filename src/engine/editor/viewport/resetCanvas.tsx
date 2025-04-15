export type TransformType = [
  horizontalScaling: number,
  verticalSkewing: number,
  horizontalSkewing: number,
  verticalScaling: number,
  horizontalTranslation: number,
  verticalTranslation: number
]

const resetCanvas = (ctx: CanvasRenderingContext2D, scale: number, offset: { x: number, y: number },
) => {
  const transform: TransformType = [
    scale, 0, 0, scale, offset.x, offset.y,
  ]
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(
    0,
    0,
    ctx.canvas.width * 2,
    ctx.canvas.height * 2,
  )

  ctx.setTransform(...transform)
}

export default resetCanvas