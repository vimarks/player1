import { constants } from './constants.js'
import { Bullet } from './bullet.js'
import { Moving } from './moving.js'

export class Shuttle extends Moving {
  constructor(state, activeKeys) {
    super(state, 'shuttle', 0, 0, 0, 0, 0)
    this.activeKeys = activeKeys
    this.reloading = false
  }

  tick(dt, stage) {
    let activeKeys = this.activeKeys

    if (activeKeys.left && !activeKeys.right) {
      this.rotateBy(constants.shuttleRotation, dt)
    } else if (activeKeys.right) {
      this.rotateBy(-constants.shuttleRotation, dt)
    }

    if (activeKeys.up) {
      this.accelerate(this.rotation, constants.shuttleAcceleration, constants.shuttleMaxVelocity, dt)
    }

    if (activeKeys.space && !this.reloading) {
      let bullet = new Bullet(this.state, this.offsetX, this.offsetY, this.rotation, this.velocityX, this.velocityY)
      bullet.start(stage)
      this.state.bullets.push(bullet)
      this.reloading = true
      setTimeout(() => { this.reloading = false }, constants.reloadTime)
    }

    super.tick(dt, stage)
  }

  onLeaveLeft() {
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveRight() {
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveTop() {
    this.moveTo(this.offsetX, -this.offsetY)
  }

  onLeaveBottom() {
    this.moveTo(this.offsetX, -this.offsetY)
  }
}
