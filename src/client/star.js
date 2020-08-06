import constants from '../constants.js'
import { Node } from './node.js'
import { Event } from '../event.js'
import { randRange } from '../rand.js'

export class Star extends Node {
  constructor({ offsetX, offsetY, scale }) {
    let node = Stage.image('star')
    super(node, offsetX, offsetY, 0, scale)
    this.smallScale = scale * 0.6
  }

  start(stage) {
    super.start(stage)
    this.shrink()
  }

  shrink() {
    this.node
      .tween(500)
      .scale(this.smallScale)
      .done(() => this.grow())
  }

  grow() {
    this.node
      .tween(1000)
      .delay(randRange(0, 1000))
      .scale(this.scale)
      .done(() => this.shrink())
  }
}

export class StarField {
  start(stage) {
    const width = stage.width()
    const height = stage.height()
    for (var i = 0; i < constants.starfieldSize; i++) {
      const offsetX = randRange(-width / 2, width / 2)
      const offsetY = randRange(-height / 2, height / 2)
      const scale = randRange(0.5, 1.0)
      const star = new Star({ offsetX, offsetY, scale })
      star.start(stage)
    }
  }
}
