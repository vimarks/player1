import Stage from 'stage-js/platform/web'
import constants from './constants.js'
import { Moving } from './moving.js'
import * as Trig from './trig.js'

export class Bullet extends Moving {
  constructor(offsetX, offsetY, rotation, velocityX, velocityY) {
    // Given velocity and rotation are from the shuttle when the bullet was
    // fired, so add velocity direction the ship was facing to make the bullet
    // fly away from the ship
    let newVelocityX =
      velocityX + Trig.calculateHorizontal(rotation, constants.bulletVelocity)
    let newVelocityY =
      velocityY + Trig.calculateVertical(rotation, constants.bulletVelocity)

    // Initialize with the 'bullet' image with the location and rotation of the
    // shuttle but with the new velocity
    let node = Stage.image('bullet')
    super(
      node,
      offsetX,
      offsetY,
      rotation,
      undefined,
      newVelocityX,
      newVelocityY
    )
    this.expires = performance.now() + constants.bulletDecay
  }

  tick(dt, stage) {
    super.tick(dt, stage)

    if (performance.now() >= this.expires) {
      this.remove.emit()
    }
  }

  /**
   * When the bullet leaves the screen, wrap it around vertically or
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
