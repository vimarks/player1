import constants from '../constants.js'
import { Moving } from './moving.js'

export class Projectile extends Moving {
  constructor(node, offsetX, offsetY, rotation, velocityX, velocityY) {
    super(node, offsetX, offsetY, rotation, undefined, velocityX, velocityY)
  }

  start(stage) {
    super.start(stage)
    this.leave.on(side => this.onLeave(side))
  }

  tick(dt, stage) {
    super.tick(dt, stage)
    if (performance.now() >= this.expires) {
      this.remove.emit()
    }
  }

  /**
   * When the projectile leaves the screen, wrap it around vertically or
   * horizontally.
   */
  onLeave(side) {
    if (side === 'top' || side === 'bottom') {
      this.moveTo(this.offsetX, -this.offsetY)
    } else if (side === 'left' || side === 'right') {
      this.moveTo(-this.offsetX, this.offsetY)
    }
  }
}
