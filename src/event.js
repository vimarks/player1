/**
 * An object that represents something that happens during the course of a game.
 * When emitted, events call all registered callbacks.
 */
export class Event {
  constructor(...preArgs) {
    this.preArgs = preArgs
    this.callbacks = []
  }

  /**
   * Register a callback when the event occurs.
   */
  on(callback) {
    this.callbacks.push(callback)
    return this
  }

  /**
   * Trigger another event when the event occurs.
   */
  trigger(otherEvent) {
    return this.on((...args) => otherEvent.emit(...args))
  }

  /**
   * Emit an occurrence of the event, with arguments.
   */
  emit(...args) {
    this.callbacks.forEach(cb => cb(...this.preArgs, ...args))
  }
}
