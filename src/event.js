/**
 * An object that represents something that happens during the course of a game.
 * When emitted, events call all registered callbacks.
 */
export class Event {
  constructor() {
    this.callbacks = new Set()
    this.onceCallbacks = new WeakSet()
  }

  /**
   * Register a callback when the event occurs.
   */
  on(callback) {
    this.callbacks.add(callback)
    return this
  }

  /**
   * Register a callback to run only once when the event occurs.
   */
  once(callback) {
    this.onceCallbacks.add(callback)
    return this.on(callback)
  }

  /**
   * Trigger another event when the event occurs.
   */
  trigger(otherEvent, ...preArgs) {
    return this.on((...args) => otherEvent.emit(...preArgs, ...args))
  }

  /**
   * Register a callback to run when the event occurs, but only until another
   * event is triggered.
   */
  until(untilEvent, callback) {
    untilEvent.once(() => this.callbacks.delete(callback))
    return this.on(callback)
  }

  /**
   * Emit an occurrence of the event, with arguments.
   */
  emit(...args) {
    const onceCallbacks = this.onceCallbacks
    this.callbacks.forEach(cb => {
      if (onceCallbacks.has(cb)) this.callbacks.delete(cb)
      cb(...args)
    })
    return this
  }
}
