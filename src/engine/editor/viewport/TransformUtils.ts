/** Convert canvas coordinates to screen coordinates */
export function canvasToScreen(scale: number, offsetX: number, offsetY: number, canvasX: number, canvasY: number): { x: number; y: number } {
  return {
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY,
  }
}

/** Convert screen (mouse) coordinates to canvas coordinates */
export function screenToCanvas(scale: number, offsetX: number, offsetY: number, screenX: number, screenY: number): { x: number; y: number } {
  return {
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale,
  }
}

/** Calculate new zoom state */
export function calculateZoom(scale: number, mouseX: number, mouseY: number, zoomFactor: number): { scale: number; offsetX: number; offsetY: number } {
  const mousePos = screenToCanvas(scale, 0, 0, mouseX, mouseY) // no offset involved for zooming calculation
  const newScale = scale * zoomFactor
  const newOffsetX = mouseX - mousePos.x * newScale
  const newOffsetY = mouseY - mousePos.y * newScale

  return { scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY }
}

/** Calculate pan movement */
export function calculatePan(scale: number, offsetX: number, offsetY: number, lastX: number, lastY: number, mouseX: number, mouseY: number): { offsetX: number; offsetY: number } {
  const dx = mouseX - lastX
  const dy = mouseY - lastY
  const newOffsetX = offsetX + dx
  const newOffsetY = offsetY + dy

  return { offsetX: newOffsetX, offsetY: newOffsetY }
}