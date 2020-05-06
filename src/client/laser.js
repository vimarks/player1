import { Event } from '../event.js'
import constants from '../constants.js'
import * as Trig from '../trig.js'
import sounds from './sounds.js'
import { Projectile } from './projectile.js'

export class Laser extends Projectile {
  constructor({ offsetX, offsetY, rotation, velocityX, velocityY }) {
    let newVelocityX =
      velocityX +
      Trig.calculateHorizontal(rotation, constants.bulletVelocity * 3)
    let newVelocityY =
      velocityY + Trig.calculateVertical(rotation, constants.bulletVelocity * 3)

    let node = Stage.image('laser')
    super(node, offsetX, offsetY, rotation, newVelocityX, newVelocityY)
    this.expires = performance.now() + constants.laserDecay
  }

  start(stage) {
    super.start(stage)
    sounds.shootLaser.emit()
  }
}
