declare  global {

  /**
   * Utility type for JSON standard types.
   */
  type JSONStandardType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
  type JSONPrimitiveValue = string | number | boolean | null;
  type JSONValue = JSONPrimitiveValue | JSONObject | JSONArray
  type JSONArray = JSONValue[];
  type JSONObject = Map<string, JSONValue>

  type TreeNode = {
    id: number;
    parentId: number | null;
  };

  interface FlattenedTreeNode extends TreeNode {
    keyName?: string
    value: JSONPrimitiveValue
    type: JSONStandardType
    prev?: number
    next?: number
    children: number[]
  }

  type FlattenedTreeNodeMap = Map<number, FlattenedTreeNode>

  interface Size {
    width: number;
    height: number;
  }

  interface Position {
    x: number;
    y: number;
  }

  type Rect = Size & Position
  type BoundingRect = Size & Position & {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }

  type Resolution = Size

  type Positions = Map<TreeNode["id"], Rect>

  type MeasuredDataRecord = Size & Positions

  type DPR = number

  type ZoomRatio = number
}

export {};