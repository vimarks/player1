import { constants } from './constants.js'
import { Bullet } from './bullet.js'

let twoPi = 2 * Math.PI

export class Shuttle {
  constructor(state, activeKeys) {
    this.state = state
    this.activeKeys = activeKeys

    this.rotation = 0
    this.velocityX = 0
    this.velocityY = 0
    this.offsetX = 0
    this.offsetY = 0
    this.reloading = false
    this.node = Stage.image('shuttle')
  }

  start(stage) {
    this.node.appendTo(stage)
    this.node.pin('align', 0.5)
  }

  tick(dt, stage) {
    let activeKeys = this.activeKeys

    if (activeKeys.left && !activeKeys.right) {
      this.rotation += constants.shuttleRotation * dt
      if (this.rotation > twoPi) {
        this.rotation -= twoPi
      }
    } else if (activeKeys.right) {
      this.rotation -= constants.shuttleRotation * dt
      if (this.rotation < -twoPi) {
        this.rotation += twoPi
      }
    }

    if (activeKeys.up) {
      this.velocityX += Math.sin(this.rotation) * dt * constants.shuttleAcceleration
      this.velocityY -= Math.cos(this.rotation) * dt * constants.shuttleAcceleration

      let velocity = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY)
      if (velocity >= constants.shuttleMaxVelocity) {
        let adjustment = constants.shuttleMaxVelocity / velocity
        this.velocityX *= adjustment
        this.velocityY *= adjustment
      }
    }

    if (activeKeys.space && !this.reloading) {
      let bullet = new Bullet(this.state, this.offsetX, this.offsetY, this.rotation, this.velocityX, this.velocityY)
      bullet.start(stage)
      this.state.bullets.push(bullet)
      this.reloading = true
      setTimeout(() => { this.reloading = false }, constants.reloadTime)
    }

    this.offsetX += this.velocityX
    this.offsetY += this.velocityY

    let rightEdge = this.state.getRightEdge(this.node)
    let bottomEdge = this.state.getBottomEdge(this.node)
    if (this.offsetX >= rightEdge || this.offsetX <= -rightEdge) {
      this.offsetX = -this.offsetX
    }
    if (this.offsetY >= bottomEdge || this.offsetY <= -bottomEdge) {
      this.offsetY = -this.offsetY
    }

    this.node.pin({
      rotation: this.rotation,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    })
  }
}
