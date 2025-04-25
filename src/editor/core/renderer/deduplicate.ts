const deduplicateObjectsByKeyValue = <T>(objects: T[]): T[] => {
  if (!Array.isArray(objects)) return []

  const seen = new Set<string>()

  return objects.filter((item: T) => {
    const key = Object.keys(item as Record<string, unknown>)
      .sort()
      .map(key => `${key}:${String((item as Record<string, unknown>)[key])}`)
      .join(';')

    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

export default deduplicateObjectsByKeyValue