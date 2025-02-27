import typeCheck from "../../utilities/typeCheck.ts";

const flatData = (entry: JSONValue): FlattenDataRecord => {
  const result: FlattenDataRecord = {};
  let idCounter = 0;

  const traverse = (id: number, value: JSONValue, keyName?: string): FlattenDataBase => {
    // const nodeId = idCounter++;
    const nodeType = typeCheck(value);
    const isComplexType = nodeType === 'object' || nodeType === 'array';

    const node: FlattenDataBase = {
      id,
      keyName,
      value: isComplexType ? null : value as JSONPrimitiveValue,
      type: nodeType,
      children: []
    }

    result[id] = node

    if (nodeType === 'object' && value !== null) {
      Object.entries(value).forEach(([childKey, childValue]) => {
        const childId = ++idCounter;
        const child = traverse(childId, childValue, childKey);

        node.children.push(child.id);
      });
    } else if (nodeType === 'array') {
      (value as JSONArray).forEach((childValue) => {
        const childId = ++idCounter;
        const child = traverse(childId, childValue);

        node.children.push(child.id);
      });
    }

    return node;
  };

  traverse(0, entry);

  return result;
}


export default flatData;