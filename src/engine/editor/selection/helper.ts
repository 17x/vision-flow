const getBoxControlPoints = (cx: number, cy: number, w: number, h: number, rotation: number): Position[] => {
  const halfW = w / 2;
  const halfH = h / 2;

  // Convert rotation angle from degrees to radians
  const angle = rotation * (Math.PI / 180);

  // Precompute sine and cosine to optimize repeated calculations
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  // Control points before rotation
  const points: Position[] = [
    {x: cx - halfW, y: cy - halfH}, // Top-left
    {x: cx, y: cy - halfH},         // Top-center
    {x: cx + halfW, y: cy - halfH}, // Top-right
    {x: cx + halfW, y: cy},         // Right-center
    {x: cx + halfW, y: cy + halfH}, // Bottom-right
    {x: cx, y: cy + halfH},         // Bottom-center
    {x: cx - halfW, y: cy + halfH}, // Bottom-left
    {x: cx - halfW, y: cy},         // Left-center
  ];

  // Rotate each point around the center
  return points.map(({x, y}) => {
    const dx = x - cx;
    const dy = y - cy;

    // Apply rotation
    return {
      x: cx + dx * cosAngle - dy * sinAngle,
      y: cy + dx * sinAngle + dy * cosAngle,
    };
  });
};

const isInsideRotatedRect = (
  mouseX: number,
  mouseY: number,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  rotation: number
): boolean => {
  if (width <= 0 || height <= 0) {
    return false; // Invalid rectangle dimensions
  }

  // If the rotation is 0, no need to apply any rotation logic
  if (rotation === 0) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return (
      mouseX >= centerX - halfWidth && mouseX <= centerX + halfWidth &&
      mouseY >= centerY - halfHeight && mouseY <= centerY + halfHeight
    );
  }

  // Convert rotation angle from degrees to radians
  const angle = rotation * (Math.PI / 180);

  // Pre-calculate sine and cosine of the rotation angle for optimization
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  // Step 1: Translate the mouse position to the local space of the rotated rectangle
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  // Step 2: Undo the rotation by rotating the mouse position back
  const unrotatedX = dx * cosAngle + dy * sinAngle;
  const unrotatedY = -dx * sinAngle + dy * cosAngle;

  // Step 3: Check if the unrotated mouse position lies within the bounds of the axis-aligned rectangle
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return (
    unrotatedX >= -halfWidth && unrotatedX <= halfWidth &&
    unrotatedY >= -halfHeight && unrotatedY <= halfHeight
  );
};

export {getBoxControlPoints, isInsideRotatedRect}