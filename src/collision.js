import * as Trig from './trig.js'

/**
 * A collision "group", where every node in the left set is checked against
 * every node in the right set.
 */
class Group {
  constructor(leftSet, leftEvent, rightSet, rightEvent) {
    this.leftSet = leftSet
    this.leftEvent = leftEvent
    this.rightSet = rightSet
    this.rightEvent = rightEvent
  }
}

/**
 * Detects any type of collision and calls a eventName with the colliding nodes.
 */
export class Collisions {
  constructor() {
    this.groups = []
  }

  /**
   * Register a new collision group. Every node in `leftSet` is checked with
   * every node in `rightSet`.
   */
  on(leftSet, leftEvent, rightSet, rightEvent) {
    this.groups.push(new Group(leftSet, leftEvent, rightSet, rightEvent))
  }

  start(stage) {
    stage.tick(dt => this.tick(dt, stage))
  }

  tick(dt, stage) {
    // For every collision group...
    for (const group of this.groups) {
      // ...and every node in the left set...
      for (const left of group.leftSet) {
        // ...and every node in the right set...
        for (const right of group.rightSet) {
          // ...check if the left node is touching the right node...
          if (left !== right && left.touching(right)) {
            // ...and publish events if so
            if (group.leftEvent) {
              left.node.publish(`event.${group.leftEvent}`, [right])
            }
            if (group.rightEvent) {
              right.node.publish(`event.${group.rightEvent}`, [left])
            }
          }
        }
      }
    }
  }
}
