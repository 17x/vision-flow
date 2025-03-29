const arrayToSet = (from: ModuleProps[]): Set<UID> => {
  return new Set(from.map(item => item.id))
}

const arrayToMap = (from: ModuleProps[]): Map<UID, ModuleProps> => {
  return new Map(from.map(item => [item.id, item]))
}

export {arrayToSet, arrayToMap}