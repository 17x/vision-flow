const calcNodeSelfSize = (data: FlattenedTreeNode | FlattenedTreeNodeMap, ctx: CanvasRenderingContext2D): Size => {

  const func = (node: FlattenedTreeNode): Size => {
    const isComplexType = node.type === 'object' || node.type === 'array';
    const metrics = ctx.measureText(isComplexType ? node.keyName as string : String(node.value));
    const width = metrics.width;
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    return {
      width, height
    }
  }

  return Array.isArray(data) ? data.map(item => {
    return func(item)
  }) : func(data)
}

function calculateBoundingRect(
  data: FlattenedTreeNodeMap,
  ctx: CanvasRenderingContext2D
): Rect {
  const positions: Positions = new Map();
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  const root = data.get(0)
  if (!root) throw new Error("No root node found.");
  console.log(root)
  // BFS for positioning
  const queue: { node: TreeNode; depth: number; yPos: number }[] = [
    {node: root, depth: 0, yPos: 0},
  ];

  while (queue.length > 0) {
    const {node, depth, yPos} = queue.shift()!;
    const x = depth * (nodeWidth + xSpacing);
    const y = yPos * (nodeHeight + ySpacing);

    positions.set(node.id, {x, y});

    // Update bounding box
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + nodeWidth);
    maxY = Math.max(maxY, y + nodeHeight);

    // Find children
    const children = flattenedTree.filter((n) => n.parentId === node.id);
    children.forEach((child, index) => {
      queue.push({node: child, depth: depth + 1, yPos: yPos + index + 1});
    });
  }

  return {
    width: maxX - minX,
    height: maxY - minY,
    positions: Object.fromEntries(positions),
  };
}

export {calcNodeSelfSize, calculateBoundingRect}