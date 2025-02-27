declare  global {

  /**
   * Utility type for JSON standard types.
   */
  type JSONStandardType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
  type JSONPrimitiveValue = string | number | boolean | null;
  type JSONValue = JSONPrimitiveValue | JSONObject | JSONArray
  type JSONArray = JSONValue[];

  interface JSONObject {
    [key: string]: JSONValue
  }

  interface SizeBase {
    width: number;
    height: number;
  }

  interface PositionBase {
    x: number;
    y: number;
  }

  interface Resolution {
    width: number;
    height: number;
  }

  interface FlattenDataBase {
    id: number
    keyName?: string
    value: JSONPrimitiveValue
    type: JSONStandardType
    parentId?: number
    prev?: number
    next?: number
    children: number[]
  }

  type FlattenDataRecord = Record<number, FlattenDataBase>

  type SizedDataBase = { selfSize: SizeBase, WholeSize: SizeBase } & FlattenDataBase;
  type SizedDataRecord = Record<number, SizedDataBase>

}
export {};