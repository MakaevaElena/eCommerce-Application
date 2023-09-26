import EventName from '../enum/event-name';

export default class Observer {
  static instance: Observer = new Observer();

  private listeners = new Map<EventName, Array<<T>(param?: T) => void>>();

  private constructor() {
    if (!Observer.instance) Observer.instance = this;
  }

  public static getInstance(): Observer {
    return Observer.instance;
  }

  public subscribe(eventName: EventName, listener: <T>(param?: T) => void) {
    let listeners = this.listeners.get(eventName);
    if (!listeners) {
      listeners = new Array<<T>(param?: T) => void>();
      this.listeners.set(eventName, listeners);
    }
    listeners.push(listener);
  }

  public unsubscribe(eventName: EventName) {
    this.listeners.delete(eventName);
  }

  public notify<T>(eventName: EventName, param?: T) {
    const listenerArray = this.listeners.get(eventName);
    if (listenerArray) {
      listenerArray.forEach((listener) => listener(param));
    }
  }
}
