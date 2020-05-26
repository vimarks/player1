import constants from '../constants.js'
import { Event } from '../event.js'
import { randRange } from '../rand.js'
import { elapsed } from '../time.js'

export class PowerupMaker {
  constructor() {
    this.newPowerup = new Event()
  }

  start(stage) {
    setInterval(() => this.maybeMakePowerups(stage), 5000)
  }

  maybeMakePowerups(stage) {
    if (Math.random() < constants.newPowerupChance) {
      let powerup = this.makePowerup(stage)
      this.newPowerup.emit(powerup)
    }
  }

  typeSelector() {
    let types = ['lasers', 'bullets']
    let randIndex = Math.floor(randRange(0, types.length))
    return types[randIndex]
  }
  // randomly select the type of powerup and return it in the object.
  makePowerup(stage) {
    let offsetX = randRange(-stage.width() / 2, stage.width() / 2)
    let offsetY = randRange(-stage.height() / 2, stage.height() / 2)
    let when = elapsed()
    let type = this.typeSelector()
    return { when, offsetX, offsetY, type }
  }
}
