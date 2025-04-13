// import Editor from '../editor.ts'
import {EditorEventData, EditorEventType} from './type'

export type EventsCallback<K extends EditorEventType> = EditorEventData<K> extends never ? () => void : (data: EditorEventData<K>) => void;

class Action {
  private readonly eventsMap: Map<
    EditorEventType,
    (EditorEventData<EditorEventType> extends never ? () => void : (data: EditorEventData<EditorEventType>) => void)[]
  > = new Map()

  constructor() {}

  // subscribe
  public on<K extends EditorEventType>(
    eventName: K,
    callback: EventsCallback<K>,
  ) {
    if (this.eventsMap.has(eventName)) {
      this.eventsMap
        .get(eventName)!
        .push(callback as EventsCallback<EditorEventType>)
    } else {
      this.eventsMap.set(eventName, [
        callback as EventsCallback<EditorEventType>,
      ])
    }
  }

  // unsubscribe
  public off<K extends EditorEventType>(
    eventName: K,
    callback: EventsCallback<K>,
  ) {
    if (this.eventsMap.has(eventName)) {
      const arr = this.eventsMap.get(eventName)!

      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === callback) {
          arr.splice(i, 1)
          return 'deleted'
        }
      }

      return 'Cannot find event or function'
    }
  }

  public dispatch<K extends EditorEventType>(
    type: K,
    data?: EditorEventData<K>,
  ) {
    // console.info('action: ', type,data)
    // console.info('action: ', type)

    if (this.eventsMap.has(type)) {
      this.eventsMap.get(type)!.forEach((cb) => {
        cb(data as EditorEventData<K>)
      })
    }
  }

  public execute<K extends EditorEventType>(type: K, data: EditorEventData<K>) {
    this.dispatch(type, data)

    // console.log(type,data)
  }

  public destroy() {
    this.eventsMap.clear()
  }
}

export default Action
