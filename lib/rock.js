import { constants } from './constants.js'
import { Moving } from './moving.js'

export class RockMaker {
  constructor(state) {
    this.numRocksStart = 10
    this.rocksPct = 0.6
    this.state = state
  }

  start(stage) {
    // Regularly create new rocks
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
    // Choose random velocity in range (-100, 100)
    let velocityX = Math.random() * 200 - 100
    let velocityY = Math.random() * 200 - 100

    // Snap position to top/bottom and left/right based on
    // rock velocity in either direction
    let offsetX = stage.pin('width') / 2
    let offsetY = stage.pin('height') / 2

    if (velocityX >= 0) offsetX = -offsetX
    if (velocityY >= 0) offsetY = -offsetY

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
