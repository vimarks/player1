import { Event } from '../event.js'
import sounds from './sounds.js'
import { Text } from './text.js'
import { Bullet } from './bullet.js'
import { Laser } from './laser.js'

const defaultType = 'bullets'

export function newProjectile({ type, ...row }) {
  if (type === 'bullets') {
    return new Bullet(row)
  } else if (type === 'lasers') {
    return new Laser(row)
  } else {
    throw new KeyError(type)
  }
}

export class Cannon extends Text {
  constructor(shooter) {
    super({ alignX: 0.1, alignY: 0.92 })
    this.shooter = shooter
    this.value = defaultType
    this.arm = new Event()
    this.fire = new Event()
  }

  start(stage) {
    super.start(stage)
    this.arm.on(powerup => this.changeAmmo(powerup))
  }

  changeAmmo({ type }) {
    this.value = type
  }

  shoot(stage) {
    const shooter = this.shooter
    this.fire.emit({
      type: this.value,
      offsetX: shooter.offsetX,
      offsetY: shooter.offsetY,
      rotation: shooter.rotation,
      velocityX: shooter.velocityX,
      velocityY: shooter.velocityY,
    })
  }
}
