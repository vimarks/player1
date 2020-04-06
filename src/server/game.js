import constants from '../constants.js'
import { RockMaker } from './rockmaker.js'
import { StateDoc } from '../state/doc.js'
import { elapsed } from '../time.js'

/**
 * A single game, which exists on the server and persists across multiple
 * connections.
 */
export class Game {
  constructor() {
    this.doc = new StateDoc()
    this.startTime = elapsed()
  }

  start(stage) {
    this.doc.initialize()

    const rockMaker = new RockMaker(this.startTime)
    rockMaker.start(stage)
    rockMaker.newRock.on(rock => {
      // Push new rocks into the static doc
      this.doc.change(doc => doc.rocks.add(rock))
    })
  }
}
