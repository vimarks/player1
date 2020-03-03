import { constants } from './constants.js'
import { Shuttle } from './shuttle.js'

export class State {
  constructor(activeKeys) {
    this.shuttle = new Shuttle(this, activeKeys)
    this.bullets = [];
  }

  start(stage) {
    stage.on('viewport', viewport => this.updateViewbox(stage, viewport))

    this.shuttle.start(stage)
    for (bullet of this.bullets) {
      bullet.start(stage)
    }
  }

  updateViewbox(stage, viewport) {
    let aspectRatio = viewport.width / viewport.height
    let width = this.viewboxWidth = aspectRatio * constants.viewboxHeight
    let height = this.viewboxHeight = constants.viewboxHeight
    stage.viewbox(width, height, 'in-pad')
  }

  getRightEdge(node) {
    return (node.pin('width') + this.viewboxWidth) / 2
  }

  getBottomEdge(node) {
    return (node.pin('height') + this.viewboxHeight) / 2
  }

  tick(dt, stage) {
    this.shuttle.tick(dt, stage)
    for (let bullet of this.bullets) {
      bullet.tick(dt, stage)
    }
  }
}
