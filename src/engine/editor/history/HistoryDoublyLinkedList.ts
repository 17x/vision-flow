import {HistoryActionType} from "../editor";

type Prev = HistoryNode | null;
type Next = Prev

export interface HistoryValue {
  type: HistoryActionType,
  modules?: ModuleProps[],
  selectedItems?: UID[]
}

class HistoryNode {
  value: HistoryValue;
  prev: Prev;
  next: Next

  constructor(prev: Prev, next: Next, value: HistoryValue) {
    this.value = value;
    this.prev = prev;
    this.next = next;
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
    if (this.current) {
      const newNode = new HistoryNode(this.current, null, value);

      this.current.next = newNode;
      this.current = newNode;
      this.tail = newNode;
    } else {
      this.add(value)
    }
  }

  private add(value: HistoryValue): HistoryNode {
    const newNode = new HistoryNode(null,
      null,
      value);

    if (this.head) {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    } else {
      this.head = newNode;
      this.tail = newNode;
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