import { Event } from '../event.js'

/**
 * Takes a stream of action update events and categorizes them into individual
 * actions, with a cached value.
 */
export class Actions extends Event {
  constructor(actions) {
    super()
    for (const action of actions) {
      this[action] = new Action()
    }

    // When an action is set or cleared...
    this.on((action, value, when) => {
      const actionObj = this[action]
      if (actionObj instanceof Action) {
        actionObj.value = value
        actionObj.when = when
        if (value === null) actionObj.clear.emit(when)
        else actionObj.emit(value, when)
      }
    })
  }
}

/**
 * An action, which has a last-updated time and current value.
 */
class Action extends Event {
  constructor() {
    super()
    this.value = null
    this.when = null
    this.clear = new Event()
  }

  /**
   * True if the action is a non-null value.
   */
  get active() {
    return this.value !== null
  }
}
