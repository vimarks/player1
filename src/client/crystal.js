import sounds from './sounds.js'
import { Moving } from './moving.js'

export class Crystal extends Moving {
  constructor({ offsetX, offsetY }) {
    let node = Stage.anim('crystal')
    super(node, offsetX, offsetY)
  }

  static add(stage, data, when) {
    sounds.crystalSpawn.emit()
    return super.add(stage, data, when)
  }

  start(stage) {
    super.start(stage)
    this.node.repeat(10, () => this.remove.emit()).fps(60)
  }
}
