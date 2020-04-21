import sounds from './sounds.js'
import { Node } from './node.js'

export class Crystal extends Node {
  constructor({ offsetX, offsetY }) {
    let node = Stage.anim('crystal')
    super(node, offsetX, offsetY)
  }

  start(stage) {
    super.start(stage)
    sounds.crystalSpawn.emit()
    this.node.repeat(10, () => this.remove.emit()).fps(60)
  }
}
