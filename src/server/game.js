import constants from '../constants.js'
import { Event } from '../event.js'
import { elapsed } from '../time.js'
import { StateDoc } from '../doc.js'
import { RockMaker } from './rockmaker.js'

// Mimicks the methods we need on the `stage` object
const stage = {
  first: () => stage,
  width: () => constants.viewbox.width,
  height: () => constants.viewbox.height,
}

/**
 * A single game, which exists on the server and persists across multiple
 * connections.
 */
export class Game {
  constructor() {
    this.doc = new StateDoc()
    this.join = new Event()
    this.leave = new Event()
    this.end = new Event()
  }

  start() {
    // Initialize the shared state doc
    this.doc.initialize()

    // Keep track of game connections
    const connections = new Set()
    let endTimeout = null
    this.join
      .on(conn => this.doc.sync(conn))
      .on(conn => connections.add(conn))
      .on(() => clearTimeout(endTimeout))
    this.leave
      .on(conn => connections.delete(conn))
      .on(() => clearTimeout(endTimeout))
      .on(() => {
        endTimeout = setTimeout(() => {
          if (connections.size === 0) this.end.emit()
        }, constants.serverGameExpiration)
      })

    // Begin generating rocks
    const rockMaker = new RockMaker()
    rockMaker.start(stage)
    rockMaker.newRock.on(rock => {
      // Push new rocks into the static doc
      this.doc.change(doc => doc.rocks.add(rock))
    })
  }
}
