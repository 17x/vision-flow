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
    { x: cx - halfW, y: cy - halfH }, // Top-left
    { x: cx, y: cy - halfH },         // Top-center
    { x: cx + halfW, y: cy - halfH }, // Top-right
    { x: cx + halfW, y: cy },         // Right-center
    { x: cx + halfW, y: cy + halfH }, // Bottom-right
    { x: cx, y: cy + halfH },         // Bottom-center
    { x: cx - halfW, y: cy + halfH }, // Bottom-left
    { x: cx - halfW, y: cy },         // Left-center
  ];

  // Rotate each point around the center
  return points.map(({ x, y }) => {
    const dx = x - cx;
    const dy = y - cy;

    // Apply rotation
    return {
      x: cx + dx * cosAngle - dy * sinAngle,
      y: cy + dx * sinAngle + dy * cosAngle,
    };
  });
};
export default getBoxControlPoints