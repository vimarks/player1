import constants from '../constants.js'
import { Event } from '../event.js'
import { randRange } from '../rand.js'
import { elapsed } from '../time.js'

export class CrystalMaker {
  constructor() {
    this.newCrystal = new Event()
  }

  start(stage) {
    setInterval(() => this.maybeMakeCrystals(stage), 2000)
  }

  maybeMakeCrystals(stage) {
    if (Math.random() < constants.newCrystalChance) {
      let crystal = this.makeCrystal(stage)
      this.newCrystal.emit(crystal)
    }
  }

  makeCrystal(stage) {
    let offsetX = randRange(-stage.width() / 2, stage.width() / 2)
    let offsetY = randRange(-stage.height() / 2, stage.height() / 2)

    let when = elapsed()
    return { when, offsetX, offsetY }
  }
}
