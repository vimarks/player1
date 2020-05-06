import sounds from './sounds.js'
import { Node } from './node.js'

export class Powerup extends Node {
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
