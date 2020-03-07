import { constants } from './constants.js'
import { Moving } from './moving.js'

export class Bullet extends Moving {
  constructor(state, offsetX, offsetY, rotation, velocityX, velocityY) {
    // Given velocity and rotation are from the shuttle when the bullet was
    // fired, so add velocity direction the ship was facing to make the bullet
    // fly away from the ship
    let newVelocityX = velocityX + Math.sin(rotation) * constants.bulletVelocity
    let newVelocityY = velocityY + -Math.cos(rotation) * constants.bulletVelocity

    // Initialize with the 'bullet' image with the location and rotation of the
    // shuttle but with the new velocity
    super(state, 'bullet', offsetX, offsetY, rotation, newVelocityX, newVelocityY)
  }

  onLeaveLeft() {
    // Wrap the bullet from left to right
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveRight() {
    // Wrap the bullet from right to left
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveTop() {
    // Wrap the bullet from top to bottom
    this.moveTo(this.offsetX, -this.offsetY)
  }

  onLeaveBottom() {
    // Wrap the bullet from bottom to top
    this.moveTo(this.offsetX, -this.offsetY)
  }
}
