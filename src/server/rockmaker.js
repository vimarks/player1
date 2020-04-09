import constants from '../constants.js'
import { Event } from '../event.js'
import { randRange, randNormal, randSign } from '../rand.js'
import { elapsed } from '../time.js'

export class RockMaker {
  constructor() {
    this.numRocksStart = 10
    this.rocksPct = 0.6
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
    let game = stage.first()
    let velocityX = randSign() * randNormal(constants.rockVelocityDist)
    let velocityY = randSign() * randNormal(constants.rockVelocityDist)
    let scale = randNormal(constants.rockSizeDist)

    let side, offsetX, offsetY
    if (Math.random() < 0.5) {
      // Start the rock on the left or right side
      offsetX = game.width() * 0.45
      offsetY = randRange(-game.height() / 2, game.height() / 2)
      if (velocityX > 0) {
        offsetX = -offsetX
        side = 'left'
      } else {
        side = 'right'
      }
    } else {
      // Start the rock on the top or bottom side
      offsetX = randRange(-game.width() / 2, game.width() / 2)
      offsetY = game.height() * 0.45
      if (velocityY > 0) {
        offsetY = -offsetY
        side = 'top'
      } else {
        side = 'bottom'
      }
    }

    let when = elapsed()
    return { when, side, offsetX, offsetY, scale, velocityX, velocityY }
  }
}
