import sounds from './sounds.js'
import { Moving } from './moving.js'

export class Powerup extends Moving {
  constructor({ offsetX, offsetY, type }) {
    let node = Stage.anim('powerup')
    super(node, offsetX, offsetY)
    this.type = type
  }

  start(stage) {
    super.start(stage)
    this.node.repeat(10, () => this.remove.emit()).fps(40)
  }
}
