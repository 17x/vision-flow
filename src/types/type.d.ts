declare  global {

  /**
   * Utility type for JSON standard types.
   */
  type JSONStandardType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
  type JSONPrimitiveValue = string | number | boolean | null;
  type JSONValue = JSONPrimitiveValue | JSONObject | JSONArray
  type JSONArray = JSONValue[];
  type JSONObject = { [key: string]: JSONValue };

  type RectSizeBase = {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}
export {};