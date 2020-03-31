import Stage from 'stage-js/platform/web'
import constants from './constants.js'
import { Event } from './event.js'
import { Moving } from './moving.js'
import { randRange } from './rand.js'

export class CrystalMaker {
  constructor() {
    this.crystalSet = new Set()
  }

  start(stage) {
    setInterval(() => this.maybeMakeCrystals(stage), 2000)
  }

  maybeMakeCrystals(stage) {
    if (Math.random() < constants.newCrystalChance) {
      let crystal = this.makeCrystal(stage)
      this.crystalSet.add(crystal)
      crystal.remove.on(() => this.crystalSet.delete(crystal))
      crystal.start(stage)
    }
  }

  makeCrystal(stage) {
    let offsetX = randRange(-stage.width() / 2, stage.width() / 2)
    let offsetY = randRange(-stage.height() / 2, stage.height() / 2)

    return new Crystal(offsetX, offsetY)
  }
}

class Crystal extends Moving {
  constructor(offsetX, offsetY) {
    let node = Stage.anim('crystal')
    super(node, offsetX, offsetY)
  }

  start(stage) {
    super.start(stage)
    this.node.repeat(10, () => this.remove.emit()).fps(60)
  }
}
