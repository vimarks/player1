import Stage from 'stage-js/platform/web'
import constants from './constants.js'
import { Moving } from './moving.js'
import { randRange, randNormal, randSign } from './rand.js'

export class RockMaker {
  constructor() {
    this.numRocksStart = 10
    this.rocksPct = 0.6
    this.rockSet = new Set()
  }

  start(stage) {
    setInterval(() => this.maybeMakeRocks(stage), 500)
  }

  maybeMakeRocks(stage) {
    if (Math.random() < constants.newRockChance) {
      let rock = this.makeRock(stage)
      this.rockSet.add(rock)
      rock.onRemove(() => this.rockSet.delete(rock))
      rock.start(stage)
    }
  }

  makeRock(stage) {
    let velocityX =
      randSign() *
      randNormal(
        constants.rockVelocityDist.mu,
        constants.rockVelocityDist.sigma
      )
    let velocityY =
      randSign() *
      randNormal(
        constants.rockVelocityDist.mu,
        constants.rockVelocityDist.sigma
      )
    let scale = randNormal(
      constants.rockSizeDist.mu,
      constants.rockSizeDist.sigma
    )

    if (Math.random() < 0.5) {
      // Start the rock on the left or right side
      let offsetX = stage.width() / 2
      let offsetY = randRange(-stage.height() / 2, stage.height() / 2)
      if (velocityX > 0) offsetX = -offsetX
      return new Rock(offsetX, offsetY, scale, velocityX, velocityY)
    } else {
      // Start the rock on the top or bottom side
      let offsetX = randRange(-stage.width() / 2, stage.width() / 2)
      let offsetY = stage.height() / 2
      if (velocityY > 0) offsetY = -offsetY
      return new Rock(offsetX, offsetY, scale, velocityX, velocityY)
    }
  }
}

class Rock extends Moving {
  constructor(offsetX, offsetY, scale, velocityX, velocityY) {
    let rotation = randRange(0, 2 * Math.PI)
    let spin = randRange(-constants.rockSpinSpeed, constants.rockSpinSpeed)
    let node = Stage.image('rock')
    super(node, offsetX, offsetY, rotation, scale, velocityX, velocityY, spin)
  }

  start(stage) {
    super.start(stage)

    this.node.on('event.ricochet', bullet =>
      this.ricochet(bullet, constants.rockRicochet, 0)
    )
  }

  onLeave() {
    this.remove()
  }
}
