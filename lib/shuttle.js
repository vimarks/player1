import { constants } from './constants.js'
import { Bullet } from './bullet.js'
import { Moving } from './moving.js'

export class Shuttle extends Moving {
  constructor(state, activeKeys) {
    // Initialize with the 'shuttle' image at the center of the screen
    super(state, 'shuttle', 0, 0, 0, 0, 0)
    this.activeKeys = activeKeys
    this.reloading = false
  }

  tick(dt, parentNode) {
    // Call the Moving.tick function, which will reposition the node based
    // on current acceleration and call the onLeave*() callbacks if the
    // node has left the edge of the screen
    super.tick(dt, parentNode)

    let activeKeys = this.activeKeys

    // Rotate the shuttle left or right
    if (activeKeys.left && !activeKeys.right) {
      this.rotateBy(constants.shuttleRotation, dt)
    } else if (activeKeys.right) {
      this.rotateBy(-constants.shuttleRotation, dt)
    }

    // Accelerate the shuttle the direction it is currently facing, up to
    // a maximum velocity
    if (activeKeys.up) {
      this.accelerate(this.rotation, constants.shuttleAcceleration, constants.shuttleMaxVelocity, dt)
    }

    // Fire a bullet, unless we're waiting for the reload timer
    if (activeKeys.space && !this.reloading) {
      // Prevent more bullets from firing until the reload timer elapses
      this.reloading = true
      setTimeout(() => { this.reloading = false }, constants.reloadTime)

      // Create the bullet relative to the shuttle location and rotation
      let bullet = new Bullet(this.state, this.offsetX, this.offsetY, this.rotation, this.velocityX, this.velocityY)

      // Start the bullet, relative to the same parent node as the shuttle,
      // so that the shuttle movement does not affect the bullet.
      bullet.start(parentNode)
    }
  }

  onLeaveLeft() {
    // Wrap the shuttle from left to right
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveRight() {
    // Wrap the shuttle from right to left
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveTop() {
    // Wrap the shuttle from top to bottom
    this.moveTo(this.offsetX, -this.offsetY)
  }

  onLeaveBottom() {
    // Wrap the shuttle from bottom to top
    this.moveTo(this.offsetX, -this.offsetY)
  }
}
