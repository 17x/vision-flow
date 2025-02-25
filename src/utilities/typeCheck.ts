/**
 * Utility function to get the JSON standard type of a given variable as a string.
 *
 * @param o - The variable to be checked.
 * @returns The JSON standard type of the variable in string form (e.g., "string", "number").
 */
const getJSONType = (o: JSONValue): JSONStandardType => {
  if (o === null) return 'null';
  if (Array.isArray(o)) return 'array';
  if (typeof o === 'object') return 'object';
  return typeof o as JSONStandardType;
};
export default getJSONType