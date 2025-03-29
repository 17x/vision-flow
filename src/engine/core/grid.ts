function createGridPattern(gridSize, width, height) {
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext("2d")

  ctx.strokeStyle = "#444" // Grid color
  ctx.lineWidth = 0.5

  // Draw vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Draw horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  return offscreen
}

// Usage: Cache the grid and draw it only once
const gridCanvas = createGridPattern(50, 800, 600)
// ctx.drawImage(gridCanvas, 0, 0);