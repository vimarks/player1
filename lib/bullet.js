import { constants } from './constants.js'
import { Moving } from './moving.js'

export class Bullet extends Moving {
  constructor(state, offsetX, offsetY, rotation, velocityX, velocityY) {
    let newVelocityX = velocityX + Math.sin(rotation) * constants.bulletVelocity
    let newVelocityY = velocityY + -Math.cos(rotation) * constants.bulletVelocity
    super(state, 'bullet', offsetX, offsetY, rotation, newVelocityX, newVelocityY)
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
