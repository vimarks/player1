import { constants } from './constants.js'
import { Actions } from './actions.js'
import { Bullet } from './bullet.js'
import { Moving } from './moving.js'
import * as Trig from './trig.js'

export class Shuttle extends Moving {
  constructor() {
    // Initialize with the 'shuttle' image at the center of the screen
    super('shuttle', 0, 0, 0, 0, 0)
    this.reloading = false
    this.actions = new Actions(this.node, ['fire', 'focus', 'turnLeft', 'turnRight', 'accelerate'])
  }

  start(stage) {
    super.start(stage)

    // Listen for events we care about
    this.actions.start(stage)

    // Fire a bullet on the 'fire' action
    this.actions.on('fire', () => this.fireBullet(stage))
  }

  tick(dt, stage) {
    super.tick(dt, stage)

    // Rotate the shuttle towards the focus point
    if (this.actions.focus) {
      let focusAngle = this.getFocusAngle(this.actions.focus)
      let focusDiff = Trig.diffAngles(this.rotation, focusAngle)
      this.rotateBy(focusDiff * constants.shuttleRotation, dt)
    }

    // Rotate with the 'turnLeft' and 'turnRight' actions
    if (this.actions.turnLeft && !this.actions.turnRight) {
      this.rotateBy(-constants.shuttleRotation, dt)
    } else if (this.actions.turnRight) {
      this.rotateBy(constants.shuttleRotation, dt)
    }

    // Engage thrusters with the 'accelerate' action
    if (this.actions.accelerate) {
      this.accelerate(
        this.rotation,
        constants.shuttleAcceleration,
        constants.shuttleMaxVelocity,
        dt
      )
    }
  }

  /**
   * Calculate the angle between the shuttle position and the focus point.
   */
  getFocusAngle(focusPoint) {
    return Trig.calculateAngle(this.offsetX, this.offsetY, focusPoint.x, focusPoint.y)
  }

  fireBullet(stage) {
    if (!this.reloading) {
      // Prevent more bullets from firing until the reload timer elapses
      this.reloading = true
      setTimeout(() => {
        this.reloading = false
      }, constants.reloadTime)

      // Create the bullet relative to the shuttle location and rotation
      let bullet = new Bullet(
        this.offsetX,
        this.offsetY,
        this.rotation,
        this.velocityX,
        this.velocityY
      )

      // Start the bullet, relative to the same parent node as the shuttle,
      // so that the shuttle movement does not affect the bullet.
      bullet.start(stage)
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
