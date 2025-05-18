import typeCheck from './typeCheck.ts'

type O = { [key: string]: any; children?: O[] }
const matchObject = (o: O[] | O, predictor: (sub: O) => boolean) => {
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