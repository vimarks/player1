import { Event } from '../event.js'
import sounds from './sounds.js'
import { Laser } from './laser.js'
import { Bullet } from './bullet.js'

let ammoType = 'bullet'
export class Cannon {
  constructor() {
    this.projectileSet = new Set()
    this.arm = new Event()
    this.fire = new Event()
  }

  start(stage) {
    this.arm.on(powerup => this.changeAmmo(powerup))
    this.fire.on(shooter => this.shoot(stage, shooter))
  }

  changeAmmo({ type }) {
    ammoType = type
  }

  shoot(stage, shooter) {
    let type = null
    if (ammoType === 'bullet') {
      type = { ammo: Bullet, sound: sounds.shootBullet }
    }
    if (ammoType === 'laser') {
      type = { ammo: Laser, sound: sounds.shootLaser }
    }
    if (ammoType === 'rapidFire') {
      type = { ammo: RapidFire, sound: null }
    }
    if (ammoType === 'doubleBarrel') {
      type = { ammo: DoubleBarrel, sound: null }
    }
    let projectile = new type.ammo(
      shooter.offsetX,
      shooter.offsetY,
      shooter.rotation,
      shooter.velocityX,
      shooter.velocityY
    )

    this.projectileSet.add(projectile)
    projectile.remove.on(() => this.projectileSet.delete(projectile))

    shooter.visible && projectile.start(stage)
    type.sound.emit()
  }
}
