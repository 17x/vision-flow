import typeCheck from "../../utilities/typeCheck.ts";
import connectNode from "./connect.ts";

const flatData = (entry: JSONValue): FlattenedTreeNodeMap => {
  const result: FlattenedTreeNodeMap = new Map();
  let idCounter = 0;

  const traverse = (parentId: number, id: number, value: JSONValue, keyName?: string): FlattenedTreeNode => {
    // const nodeId = idCounter++;
    const nodeType = typeCheck(value);
    const isComplexType = nodeType === 'object' || nodeType === 'array';

    const node: FlattenedTreeNode = {
      id,
      parentId,
      keyName,
      value: isComplexType ? null : value as JSONPrimitiveValue,
      type: nodeType,
      children: []
    }

    result.set(id, node)

    if (nodeType === 'object' && value !== null) {
      Object.entries(value).forEach(([childKey, childValue]) => {
        const childId = ++idCounter;
        const child = traverse(id, childId, childValue, childKey);

        node.children.push(child.id);
      });
    } else if (nodeType === 'array') {
      (value as JSONArray).forEach((childValue) => {
        const childId = ++idCounter;
        const child = traverse(id, childId, childValue);

        node.children.push(child.id);
      });
    }

    return node;
  };

  traverse(NaN, 0, entry);

  return connectNode(result)
}


export default flatData;