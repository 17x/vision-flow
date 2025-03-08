import {ManipulationTypes} from "../editor";

type Prev = HistoryNode | null;
type Next = Prev

export interface HistoryValue {
  type: ManipulationTypes,
  modules?: ModuleProps[],
  selectedItems: UID[]
}

class HistoryNode {
  value: HistoryValue;
  prev: Prev;
  next: Next

  constructor(prev: Prev, next: Next, value: HistoryValue) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class HistoryDoublyLinkedList {
  head: HistoryNode | null;
  tail: HistoryNode | null;
  current: HistoryNode | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }

  add(value: HistoryValue): HistoryNode {
    const newNode = new HistoryNode(null,
      null,
      value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.current = newNode;

    return newNode;
  }
}

export {HistoryNode}

export default HistoryDoublyLinkedList;