import constants from '../constants.js'
import { Event } from '../event.js'
import { randRange, randNormal, randSign } from '../rand.js'

export class RockMaker {
  constructor() {
    this.newRock = new Event()
  }

  start(stage) {
    setInterval(() => this.maybeMakeRocks(stage), 500)
  }

  maybeMakeRocks(stage) {
    if (Math.random() < constants.newRockChance) {
      let rock = this.makeRock(stage)
      this.newRock.emit(rock)
    }
  }

  makeRock(stage) {
    let velocityX = randSign() * randNormal(constants.rockVelocityDist)
    let velocityY = randSign() * randNormal(constants.rockVelocityDist)
    let scale = randNormal(constants.rockSizeDist)

    let side, offsetX, offsetY
    if (Math.random() < 0.5) {
      // Start the rock on the left or right side
      offsetX = stage.width() * 0.45
      offsetY = randRange(-stage.height() / 2, stage.height() / 2)
      if (velocityX > 0) {
        offsetX = -offsetX
        side = 'left'
      } else {
        side = 'right'
      }
    } else {
      // Start the rock on the top or bottom side
      offsetX = randRange(-stage.width() / 2, stage.width() / 2)
      offsetY = stage.height() * 0.45
      if (velocityY > 0) {
        offsetY = -offsetY
        side = 'top'
      } else {
        side = 'bottom'
      }
    }

    return { side, offsetX, offsetY, scale, velocityX, velocityY }
  }
}
