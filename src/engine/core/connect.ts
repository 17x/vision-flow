const connectNode = (data: FlattenDataRecord) => {
  const nodes = Object.values(data)
  const len = nodes.length

  for (let i = 0; i < len; i++) {
    const node = nodes[i]
    const children = node.children
    let _prevId: number = children[0]

    for (let j = 1; j < children.length; j++) {
      const currId = children[j]
      const currNode = data[currId]
      const prevNode = data[_prevId]

      prevNode.next = currId
      currNode.prev = _prevId

      _prevId = currId
    }

    node.children.map((childId: number) => {
      data[childId].parentId = node.id as number
    })
  }

  return data
}


export default connectNode;