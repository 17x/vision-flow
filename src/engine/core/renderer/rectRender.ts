import {RectangleRenderProps} from "./type";
import deduplicateObjectsByKeyValue from "./deduplicate.ts";

const rectRender = (ctx: CanvasRenderingContext2D, rects: RectangleRenderProps[]): void => {
  const rectQueue: RectangleRenderProps[] = deduplicateObjectsByKeyValue(rects)
  console.log(rectQueue)

  // Start rendering
  ctx.save();

  rectQueue.forEach(({
                       x,
                       y,
                       width,
                       height,
                       enableFill,
                       fillColor,
                       enableLine,
                       lineColor,
                       lineWidth,
                       radius,
                       opacity = 100,
                       enableGradient,
                       gradient,
                       rotation = 0
                     }: RectangleRenderProps) => {

    const LocalX = width / 2;
    const LocalY = height / 2;

    // Save current context state to avoid transformations affecting other drawings
    ctx.save();

    // Move context to the rectangle's center
    ctx.translate(x + LocalX, y + LocalY);

    // Apply rotation if needed
    if (rotation > 0) {
      ctx.rotate(rotation * Math.PI / 180);
    }

    // Apply fill style if enabled
    if (enableFill && opacity > 0) {
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = opacity / 100; // Set the opacity
    }

    // Apply stroke style if enabled
    if (enableLine && lineWidth > 0) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.lineJoin = 'round';
    }

    // Draw a rounded rectangle or regular rectangle
    ctx.beginPath();
    if (radius > 0) {
      // Use arcTo for rounded corners
      ctx.moveTo(-LocalX + radius, -LocalY);
      ctx.arcTo(LocalX, -LocalY, LocalX, LocalY, radius);
      ctx.arcTo(LocalX, LocalY, -LocalX, LocalY, radius);
      ctx.arcTo(-LocalX, LocalY, -LocalX, -LocalY, radius);
      ctx.arcTo(-LocalX, -LocalY, LocalX, -LocalY, radius);
    } else {
      // For square/rectangular modules with no rounded corners
      ctx.rect(-LocalX, -LocalY, width, height);
    }
    ctx.closePath();

    // Fill if enabled
    if (enableFill && opacity > 0) {
      ctx.fill();
    }

    // Stroke if enabled
    if (enableLine && lineWidth > 0) {
      ctx.stroke();
    }

    // Restore the context to avoid affecting subsequent drawings
    ctx.restore();
  });

  console.log(`
  Total Rectangles to Render: ${rects.length}
  Rectangles in Queue: ${rectQueue.length}
`);
}

export default rectRender;

