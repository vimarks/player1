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
   * Register a callback to run when the event occurs, but only until another
   * event occurs.
   */
  until(untilEvent, callback) {
    if (untilEvent) untilEvent.once(() => this.callbacks.delete(callback))
    return this.on(callback)
  }

  /**
   * Trigger another event when the event occurs.
   */
  trigger(otherEvent, ...preArgs) {
    return this.triggerUntil(null, otherEvent, ...preArgs)
  }

  /**
   * Trigger another event when the event occurs, but only until another event
   * occurs.
   */
  triggerUntil(untilEvent, otherEvent, ...preArgs) {
    const callback = (...args) => otherEvent.emit(...preArgs, ...args)
    return this.until(untilEvent, callback)
  }

  /**
   * Return a new event that will emit conditionally based on the first
   * argument of this event, with the remaining arguments.
   */
  topic(name) {
    const topicEvent = new Event()
    this.on((topic, ...args) => {
      if (topic === name) topicEvent.emit(...args)
    })
    return topicEvent
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
