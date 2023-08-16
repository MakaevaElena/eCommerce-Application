import EventName from '../enum/event-name';

export default class Observer {
  private listeners = new Map<EventName, Array<<T>(param?: T) => void>>();

  subscribe(eventName: EventName, listener: <T>(param?: T) => void) {
    let listeners = this.listeners.get(eventName);
    if (!listeners) {
      listeners = new Array<<T>(param?: T) => void>();
      this.listeners.set(eventName, listeners);
    }
    listeners.push(listener);
  }

  unsubscribe(eventName: EventName) {
    this.listeners.delete(eventName);
  }

  notify<T>(eventName: EventName, param?: T) {
    const listenerArray = this.listeners.get(eventName);
    if (listenerArray) {
      listenerArray.forEach((listener) => listener(param));
    }
  }
}
