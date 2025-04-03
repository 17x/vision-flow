export type TransformType = [a: number, b: number, c: number, d: number, e: number, f: number]

const setCanvasRenderConfig = (ctx:CanvasRenderingContext2D, dpr:DPR, transform:TransformType) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  )

  if (transform) {
    /*
      ctx transform parameters:
    - a (horizontal scaling): Scaling factor along the x-axis. Values greater than 1 scale the content,
      and values less than 1 shrink the content along the x-axis.
    - b (vertical skewing): Skewing factor for the x-axis. Non-zero values will skew the content along the x-axis.
    - c (horizontal skewing): Skewing factor for the y-axis. Non-zero values will skew the content along the y-axis.
    - d (vertical scaling): Scaling factor along the y-axis. Values greater than 1 scale the content,
      and values less than 1 shrink the content along the y-axis.
    - e (horizontal translation): Translation (movement) along the x-axis. Positive values move the content
      to the right, negative values move it to the left.
    - f (vertical translation): Translation (movement) along the y-axis. Positive values move the content
      down, negative values move it up.
    */
    // console.log(transform)
    const [a, b, c, d, e, f] = transform
    ctx.setTransform(a, b, c, d, e * dpr, f * dpr)
  }
}

export default setCanvasRenderConfig