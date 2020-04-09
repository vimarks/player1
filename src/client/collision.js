import * as Trig from '../trig.js'
import { Event } from '../event.js'

/**
 * A collision "group", where every node in the left set is checked against
 * every node in the right set.
 */
class Group extends Event {
  constructor(leftSet, rightSet) {
    super()
    this.leftSet = leftSet
    this.rightSet = rightSet
  }

  triggerLeft(getEvent) {
    return this.on((left, right) => getEvent(left).emit(right))
  }

  triggerRight(getEvent) {
    return this.on((left, right) => getEvent(right).emit(left))
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
  detect(leftSet, rightSet) {
    let group = new Group(leftSet, rightSet)
    this.groups.push(group)
    return group
  }

  start(stage) {
    stage.tick(dt => this.tick(dt, stage))
  }

  tick(dt, stage) {
    // For every collision group...
    for (const group of this.groups) {
      // ...and every node in the left set...
      for (const left of group.leftSet.values()) {
        // ...and every node in the right set...
        for (const right of group.rightSet.values()) {
          // ...check if the left node is touching the right node...
          if (left !== right && left.touching(right)) {
            // ...and emit the event if so
            group.emit(left, right)
          }
        }
      }
    }
  }
}
