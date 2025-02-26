/**
 * Draws a grid on the given canvas context.
 *
 * @param ctx The canvas context to draw on.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @param gridSize The size of each grid cell. Defaults to 50.
 */
function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, gridSize: number = 50, strokeStyle = '#444'): void {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 0.5;

  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

export default drawGrid