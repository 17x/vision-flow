const deduplicateObjectsByKeyValue = <T extends Record<string, unknown>>(objects: T[]): T[] => {
  // Helper function to generate a unique key from the object's key-value pairs
  const generateKey = (obj: T): string => {
    return Object.keys(obj)
      .sort()
      .map(key => `${key}:${(obj)[key]}`)
      .join(';');
  };

  const seen = new Set<string>();

  return objects.filter(item => {
    const key = generateKey(item);
    if (seen.has(key)) {
      return false;
    } else {
      seen.add(key);
      return true;
    }
  });
};

export default deduplicateObjectsByKeyValue;