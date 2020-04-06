function buildEventCallback(otherEvent, preArgs) {
  return (...args) => otherEvent.emit(...preArgs, ...args)
}

/**
 * An object that represents something that happens during the course of a game.
 * When emitted, events call all registered callbacks.
 */
export class Event {
  constructor() {
    this.callbacks = new Set()
  }

  /**
   * Register a callback when the event occurs.
   */
  on(callback) {
    this.callbacks.add(callback)
    return this
  }

  /**
   * Trigger another event when the event occurs.
   */
  trigger(otherEvent, ...preArgs) {
    return this.on(buildEventCallback(otherEvent, preArgs))
  }

  /**
   * Execute the function, calling the callbacks if the event is emitted during
   * execution.
   */
  during(execute, ...callbacks) {
    callbacks.forEach(cb => this.callbacks.add(cb))
    try {
      execute.call(this)
    } finally {
      callbacks.forEach(cb => this.callbacks.delete(cb))
    }
    return this
  }

  /**
   * Emit an occurrence of the event, with arguments.
   */
  emit(...args) {
    this.callbacks.forEach(cb => cb(...args))
    return this
  }
}
