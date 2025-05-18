import typeCheck from './typeCheck.ts'

const matchObject = (o: unknown[] | { children?: unknown[] }, predictor: (...args: unknown[]) => boolean) => {
  const result: unknown[] = []

  if (Array.isArray(o)) {
    o.forEach(item => {
      if (predictor(item)) {
        result.push(item)
      }

      if (item.children) {
        item.children.forEach(child => {
          console.log(matchObject(child, predictor))
          result.push(...matchObject(child, predictor))
        })
      }
    })
  } else if (typeCheck(o) === 'object') {
    if (predictor(o)) {
      result.push(o)
    }

    if (o.children) {
      o.children.forEach(child => {
        // console.log(matchObject(child, predictor))
        result.push(...matchObject(child, predictor))
      })
    }

  }

  return result
}

export default matchObject