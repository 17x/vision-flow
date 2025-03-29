import {OrderedProps, RectangleRenderProps} from "./type";

const SEPARATOR = ','

/**
 * Separate By $SEPARATE_CHAR
 *
 * Order By : Type OrderedProps
 */
const generateModuleKey = ({
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
                             opacity,
                             enableGradient,
                             gradient,
                             rotation
                           }: RectangleRenderProps, separator: string): string =>
  `${x}${separator}${y}${separator}${width}${separator}${height}${separator}${enableFill}${separator}${fillColor}${separator}${enableLine}${separator}${lineColor}${separator}${lineWidth}${separator}${radius}${separator}${opacity}${separator}${enableGradient}${separator}${gradient}${separator}${rotation}`;

const degenerateModuleKey = (str: string, separator: string): OrderedProps => {
  const arr = str.split(separator);

  return [
    parseFloat(arr[0]),
    parseFloat(arr[1]),
    parseFloat(arr[2]),
    parseFloat(arr[3]),
    Boolean(arr[4]),
    arr[5],
    Boolean(arr[6]),
    arr[7],
    parseFloat(arr[8]),
    parseFloat(arr[9]),
    parseFloat(arr[10]),
    Boolean(arr[11]),
    arr[12],
    parseFloat(arr[13]),
  ]
};

const rectRender = (ctx: CanvasRenderingContext2D, rects: RectangleRenderProps[]): void => {
  const rectQueue: Set<string> = new Set()
  const saveGlobalOpacity = ctx.globalAlpha

  // duplicate rects
  rects.forEach((props) => {
    const s = generateModuleKey(props, SEPARATOR)

    rectQueue.add(s);
  })

  // Start rendering
  ctx.save();

  rectQueue.forEach((str) => {
    const [
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
      opacity,
      enableGradient,
      gradient,
      rotation,
    ]
      = degenerateModuleKey(str, SEPARATOR)

    ctx.translate(x + width / 2, y + height / 2);
    if (rotation > 0) {
      ctx.rotate(rotation * Math.PI / 180);
    }

    if (enableFill && opacity > 0) {
      // Set fill properties (opacity check)
      if (opacity === 100) {
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = 1; // Fully opaque
      } else {
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = opacity / 100; // Opacity scale from 0 to 1
      }
    }

    // Apply border properties (only if borderWidth > 0)
    if (enableLine && lineWidth > 0) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.lineJoin = 'round'; // Optional: makes the corners of the border smoother
    }

    // Draw a rounded rectangle or regular rectangle (depending on radius)
    ctx.beginPath();
    if (radius > 0) {
      // Use arcTo for rounded corners
      ctx.moveTo(-width / 2 + radius, -height / 2);
      ctx.arcTo(width / 2, -height / 2, width / 2, height / 2, radius);
      ctx.arcTo(width / 2, height / 2, -width / 2, height / 2, radius);
      ctx.arcTo(-width / 2, height / 2, -width / 2, -height / 2, radius);
      ctx.arcTo(-width / 2, -height / 2, width / 2, -height / 2, radius);
    } else {
      // For square/rectangular modules with no rounded corners
      ctx.rect(-width / 2, -height / 2, width, height);
    }
    ctx.closePath();

    // Fill the rectangle
    ctx.fill();

    // Stroke if necessary (if lineWidth > 0)
    if (lineWidth > 0) {
      ctx.stroke();
    }
  })

  ctx.restore();

  console.log(`
  Total Rectangles to Render: ${rects.length}
  Rectangles in Queue: ${rectQueue.size}
`);
}

export default rectRender;

