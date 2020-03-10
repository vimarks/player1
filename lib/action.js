/**
 * Listens for a specific set of actions, storing their current value and
 * propogating events to a node.
 *
 * The default source will listen for actions from the Input class, but
 * eventually actions may come from elsewhere too, like a websocket.
 */
export class ActionListener {
  constructor(node, actionNames, source = "Input") {
    this.node = node;
    this.actionNames = actionNames;
    this.source = source;
    this.times = {};
    this.actions = {};
  }

  start(stage) {
    for (let action of this.actions) {
      // When an action is activated or updated...
      stage.on(`${this.source}.action.${action}`, (when, val) => {
        console.log("set", action, when, val);
        this.node.publish(`action.${action}`, [when, val]);
        this.times[action] = when;
        this.actions[action] = val;
      });

      // When an action is cleared...
      stage.on(`${this.source}.action.${action}.clear`, when => {
        this.node.publish(`action.${action}.clear`, [when]);
        this.times[action] = when;
        this.actions[action] = undefined;
      });
    }
  }

  /**
   * Return the current value of the action.
   */
  get(action) {
    return this.actions[action];
  }

  /**
   * Return the relative time when the action was last updated or cleared.
   */
  getTime(action) {
    return this.times[action];
  }

  /**
   * Add an event listener for the action activation or update event.
   */
  on(action, callback) {
    this.node.on(`action.${action}`, callback);
  }

  /**
   * Add an event listener for the action clear event.
   */
  onClear(actionname, callback) {
    this.node.on(`action.${action}.clear`, callback);
  }
}
