export type TransformType = [
  horizontalScaling: number,
  verticalSkewing: number,
  horizontalSkewing: number,
  verticalScaling: number,
  horizontalTranslation: number,
  verticalTranslation: number
]

const resetCanvas = (ctx: CanvasRenderingContext2D, dpr: DPR, scale: number, {x, y}: { x: number, y: number }
) => {
  const transform: TransformType = [
    scale, 0, 0, scale, x * dpr, y * dpr,
  ]
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(
    0,
    0,
    ctx.canvas.width * 2,
    ctx.canvas.height * 2
  )

  ctx.setTransform(...transform)
}

export default resetCanvas