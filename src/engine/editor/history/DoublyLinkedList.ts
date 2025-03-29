import {HistoryNodeData, HistoryNext, HistoryPrev} from "./type";

class HistoryNode {
  data: HistoryNodeData;
  prev: HistoryPrev;
  next: HistoryNext
  id: number

  constructor(prev: HistoryPrev, next: HistoryNext, data: HistoryNodeData, id = -1) {
    this.data = data;
    this.prev = prev;
    this.next = next;
    this.id = id;
  }
}

class DoublyLinkedList {
  head: HistoryNode | null;
  tail: HistoryNode | null;
  current: HistoryNode | null;

  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  /**
   * Detach: detach all nodes after current
   */
  detach(): HistoryNode | null {
    if (this.current) {
      this.current.next = null
      this.tail = this.current;
    }

    return this.current
  }

  /*
  * Create a new node and connect it to the last
  * */
  protected append(data: HistoryNodeData): HistoryNode {
    let newNode
    const {tail} = this;

    if (tail) {
      newNode = new HistoryNode(tail, null, data, tail.id + 1);

      tail.next = newNode;
      this.tail = newNode;
    } else {
      newNode = new HistoryNode(null, null, data, 0);

      this.head = newNode;
      this.tail = newNode;
    }

    this.current = newNode;

    return newNode
  }

  back() {
    this.current = this.current!.prev || this.current;
  }

  forward() {
    this.current = this.current!.next || this.current;
  }
}

export {HistoryNode}

export default DoublyLinkedList;