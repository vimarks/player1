import Stage from 'stage-js/platform/web'
import { constants } from './constants.js'
import { Moving } from './moving.js'

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
      let rock = new Rock(stage, this.rockSet)
      // rockSet keeps track of all rocks on-screen
      // add rock to rockSet
      this.rockSet.add(rock)

      rock.start(stage)
    }
  }
}

class Rock extends Moving {
  constructor(stage, rockSet) {
    // Helper to randomly choose number in range [-n, n).
    let randRange = n => Math.random() * 2 * n - n
    // Helper to randomly choose number in range [max, min)
    let setRange = (min, max) => Math.random() * (max - min) + min

    let velocityX = randRange(constants.rockMaxVelocity)
    let velocityY = randRange(constants.rockMaxVelocity)

    let offsetX = stage.width() / 2
    let offsetY = randRange(stage.height() / 2)
    // Make sure rock begins on side it's moving away from.
    if (velocityX > 0) offsetX = -offsetX

    let rotation = Math.random() * 2 * Math.PI

    let maxSpin = constants.rockSpinSpeed
    let spin = Math.random() * 2 * maxSpin - maxSpin

    let node = Stage.image('rock')
    super(node, offsetX, offsetY, rotation, velocityX, velocityY, spin)

    this.rockSet = rockSet

    let scale = Math.random() * constants.rockMaxScale
    this.node.scale({ x: scale, y: scale })
    // spin the rocks
    this.node
      .tween(setRange(25, 50) * 1000)
      .pin({ rotation: randRange(10) * Math.PI })
  }

  remove() {
    super.remove()
    // remove rock from rockSet
    this.rockSet.delete(this)
  }

  onLeave() {
    this.remove()
  }
}
