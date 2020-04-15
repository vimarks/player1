import { Event } from '../event.js'

import sounds from './sounds.js'
import { Moving } from './moving.js'

export class Powerup extends Moving {
  constructor({ offsetX, offsetY }) {
    let node = Stage.anim('powerup')
    super(node, offsetX, offsetY)
  }

  static add(stage, data, when) {
    return super.add(stage, data, when)
  }

  start(stage) {
    super.start(stage)
    this.node.repeat(10, () => this.remove.emit()).fps(40)
  }
}
