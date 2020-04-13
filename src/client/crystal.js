import constants from '../constants.js'
import { Event } from '../event.js'
import { randRange } from '../rand.js'
import sounds from './sounds.js'
import { Moving } from './moving.js'

export class Crystal extends Moving {
  constructor({ offsetX, offsetY }) {
    let node = Stage.anim('crystal')
    super(node, offsetX, offsetY)
  }

  static add(stage, data, when) {
    let crystal = new Crystal(data)
    let age = when - data.mod
    crystal.start(stage)
    crystal.tick(age, stage)
    sounds.crystalSpawn.emit()
    return crystal
  }

  start(stage) {
    super.start(stage)
    this.node.repeat(10, () => this.remove.emit()).fps(60)
  }
}
