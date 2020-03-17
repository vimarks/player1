import { constants } from './constants.js'
import { Moving } from './moving.js'

export class RockMaker {
  constructor(state) {
    this.numRocksStart = 10
    this.rocksPct = 0.6
    this.state = state
    this.rockSet = new Set()
  }

  start(stage) {
    setInterval(() => this.maybeMakeRocks(stage), 500)
  }

  maybeMakeRocks(stage) {
    if (Math.random() < constants.newRockChance) {
      let rock = new Rock(this.state, stage, this.rockSet)
      // rockSet keeps track of all rocks on-screen
      // add rock to rockSet
      this.rockSet.add(rock)

      rock.start(stage)
    }
  }
}

class Rock extends Moving {
  constructor(state, stage, rockSet) {
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
    this.rockSet = rockSet

    let scale = Math.random() * constants.rockMaxScale
    this.node.scale({ x: scale, y: scale })
  }

  remove() {
    super.remove()
    // remove rock from rockSet
    this.rockSet.delete(this)
  }

  onLeaveLeft() {
    this.remove()
  }

  onLeaveRight() {
    this.remove()
  }

  onLeaveTop() {
    this.remove()
  }

  onLeaveBottom() {
    this.remove()
  }
}
