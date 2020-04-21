import { Event } from '../event.js'
import constants from '../constants.js'
import * as Trig from '../trig.js'
import { Projectile } from './projectile.js'

export class Bullet extends Projectile {
  constructor(offsetX, offsetY, rotation, velocityX, velocityY) {
    let newVelocityX =
      velocityX + Trig.calculateHorizontal(rotation, constants.bulletVelocity)
    let newVelocityY =
      velocityY + Trig.calculateVertical(rotation, constants.bulletVelocity)

    // Initialize with the 'bullet' image with the location and rotation of the
    // shuttle but with the new velocity
    let node = Stage.image('bullet')
    super(node, offsetX, offsetY, rotation, newVelocityX, newVelocityY)
  }

  start(stage) {
    super.start(stage)
    this.expires = performance.now() + constants.bulletDecay
  }

  tick(dt, stage) {
    super.tick(dt, stage)
  }
}
