import {HistoryActionType} from "../editor";

type Prev = HistoryNode | null;
type Next = Prev

export interface HistoryValue {
  type: HistoryActionType
  modules?: ModuleProps[]
  selectModules: Set<UID> | 'all'
  id?: number
}

class HistoryNode {
  value: HistoryValue;
  prev: Prev;
  next: Next
  id: number

  constructor(prev: Prev, next: Next, value: HistoryValue, id = -1) {
    this.value = value;
    this.prev = prev;
    this.next = next;
    this.id = id;
  }
}

class HistoryDoublyLinkedList {
  head: HistoryNode | null;
  tail: HistoryNode | null;
  current: HistoryNode | null;

  // length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  replaceNext(value: HistoryValue): void {
    const current = this.detach()

    if (current) {
      const newNode = new HistoryNode(this.current, null, value);

      current.next = newNode;
      this.current = newNode;
      this.tail = newNode;
      newNode.id = 0
    } else {
      this.add(value)
    }
  }

  /**
   * Detach: detach next node from current
   */
  detach(): HistoryNode | null {
    if (this.current) {
      this.current.next = null
      this.tail = this.current;
    }

    return this.current
  }

  private add(value: HistoryValue): HistoryNode {
    const newNode = new HistoryNode(null,
      null,
      value);

    if (this.head) {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
      newNode.id = this.head.id + 1;

    } else {
      this.head = newNode;
      this.tail = newNode;
      newNode.id = 0
    }

    this.current = newNode;

    return newNode;
  }

  back() {
    if (this.current!.prev) {
      this.current = this.current!.prev;
    }
  }

  forward() {
    if (this.current!.next) {
      this.current = this.current!.next;
    }
  }
}

export {HistoryNode}

export default HistoryDoublyLinkedList;