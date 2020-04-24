import constants from '../constants.js'
import * as Trig from '../trig.js'
import sounds from './sounds.js'
import { Projectile } from './projectile.js'

export class Bullet extends Projectile {
  constructor({ offsetX, offsetY, rotation, velocityX, velocityY }) {
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
    super(node, offsetX, offsetY, rotation, newVelocityX, newVelocityY)
    this.expires = performance.now() + constants.bulletDecay
  }

  start(stage) {
    super.start(stage)
    sounds.shootBullet.emit()
  }
}
