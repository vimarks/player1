import { constants } from './constants.js'
import { Moving } from './moving.js'

export class RockMaker {
  constructor(state) {
    this.numRocksStart = 10
    this.rocksPct = 0.6
    this.state = state
  }

  start(stage) {
    setInterval(() => this.maybeMakeRocks(stage), 500)
  }

  maybeMakeRocks(stage) {
    if (Math.random() < constants.newRockChance) {
      let rock = new Rock(this.state, stage)
      rock.start(stage)
    }
  }
}

class Rock extends Moving {
  constructor(state, stage) {
    // Helper to randomly choose number in range [-n, n).
    let randRange = n => Math.random() * 2 * n - n

    let velocityX = randRange(constants.rockMaxVelocity)
    let velocityY = randRange(constants.rockMaxVelocity)

    let offsetX = stage.pin('width') / 2
    let offsetY = randRange(stage.pin('height') / 2)
    // Make sure rock begins on side it's moving away from.
    if (velocityX > 0) offsetX = -offsetX

    let rotation = Math.random() * 2 * Math.PI
    super('rock', offsetX, offsetY, rotation, velocityX, velocityY)
  }

  onLeaveLeft() {
    this.node.remove()
  }

  onLeaveRight() {
    this.node.remove()
  }

  onLeaveTop() {
    this.node.remove()
  }

  onLeaveBottom() {
    this.node.remove()
  }
}
