/**
 * Listens for a specific set of actions, storing their current value and
 * propogating events to a node.
 *
 * The default source will listen for actions from the Input class, but
 * eventually actions may come from elsewhere too, like a websocket or AI.
 */
export class Actions {
  constructor(node, source, actions) {
    this.node = node
    this.source = source
    this.actions = actions
    this.times = {}
    this.values = {}

    // Add a new getter for each action value, for cleaner access:
    // this.foo === this.get('foo')
    for (let action of actions) {
      if (!this.hasOwnProperty(action)) {
        Object.defineProperty(this, action, { get: () => this.get(action) })
      }
    }
  }

  start(stage) {
    for (let action of this.actions) {
      // When an action is activated or updated...
      stage.on(`${this.source}.action.${action}`, (when, val) => {
        this.node.publish(`action.${action}`, [when, val])
        this.times[action] = when
        this.values[action] = val
      })

      // When an action is cleared...
      stage.on(`${this.source}.action.${action}.clear`, when => {
        this.node.publish(`action.${action}.clear`, [when])
        this.times[action] = when
        this.values[action] = undefined
      })
    }
  }

  /**
   * Return the action value if it has one, or undefined.
   */
  get(action) {
    return this.values[action]
  }

  /**
   * Return the relative time when the action was last updated or cleared.
   */
  getTime(action) {
    return this.times[action]
  }

  /**
   * Add an event listener for the action activation or update event.
   */
  on(action, callback) {
    this.node.on(`action.${action}`, callback)
  }

  /**
   * Add an event listener for the action clear event.
   */
  onClear(action, callback) {
    this.node.on(`action.${action}.clear`, callback)
  }
}
