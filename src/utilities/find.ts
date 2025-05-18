import typeCheck from './typeCheck.ts'

const matchObject = (o: unknown[] | { children?: unknown[] }, predictor: (...args: unknown[]) => boolean) => {
  const result: unknown[] = []

  if (Array.isArray(o)) {
    o.forEach(item => {
      result.push(...matchObject(item, predictor))
    })
  } else if (typeCheck(o) === 'object') {
    if (predictor(o)) {
      result.push(o)
    }

    if (o.children) {
      o.children.forEach(child => {
        result.push(...matchObject(child, predictor))
      })
    }
  }

  return result
}

export default matchObject