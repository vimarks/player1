import constants from '../constants.js'
import { randRange } from '../rand.js'
import sounds from './sounds.js'
import { Moving } from './moving.js'

export class Crystal extends Moving {
  constructor({ offsetX, offsetY }) {
    let node = Stage.anim('crystal')
    super(node, offsetX, offsetY)
  }

  start(stage) {
    super.start(stage)
    this.node.repeat(10, () => this.remove.emit()).fps(60)
  }
}
