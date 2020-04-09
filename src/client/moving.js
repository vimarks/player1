import constants from '../constants.js'
import * as Trig from '../trig.js'
import { Event } from '../event.js'
import { Node } from './node.js'

/**
 * Base class extending Node with the ability to move around the screen.
 */
export class Moving extends Node {
  constructor(
    node,
    offsetX,
    offsetY,
    rotation,
    scale,
    velocityX = 0,
    velocityY = 0,
    spin = 0
  ) {
    super(node, offsetX, offsetY, rotation, scale)
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.spin = spin
    this.leave = new Event()
  }

  /**
   * Gets the X-coordinate where the node disappears off the screen.
   */
  getRightEdge(stage) {
    return stage.width() / 2 + this.radius * 2
  }

  /**
   * Gets the Y-coordinate where the node disappears off the screen.
   */
  getBottomEdge(stage) {
    return stage.height() / 2 + this.radius * 2
  }

  /**
   * Moves the node relative to its current position, adjusted for framerate.
   */
  moveBy(xAmount, yAmount, dt) {
    let adjust = dt ? dt * constants.dtCoefficient : 1
    let relOffsetX = xAmount ? xAmount * adjust : 0
    let relOffsetY = yAmount ? yAmount * adjust : 0
    if (relOffsetX !== 0 || relOffsetY !== 0) {
      this.moveTo(this.offsetX + relOffsetX, this.offsetY + relOffsetY)
    }
  }

  /**
   * Rotates the node relative to its current angle, adjusted for framerate.
   */
  rotateBy(amount, dt) {
    let adjust = dt ? dt * constants.dtCoefficient : 1
    let relRotation = amount ? amount * adjust : 0
    if (relRotation !== 0) {
      this.rotateTo(this.rotation + relRotation)
    }
  }

  /**
   * Update the velocity of the node based on an acceleration amount and
   * direction, adjusted for framerate. If maxVelocity is given, the node
   * cannot accelerate faster than that value.
   */
  accelerate(direction, amount, maxVelocity, dt) {
    let adjust = dt ? dt * constants.dtCoefficient : 1
    this.velocityX += Trig.calculateHorizontal(direction, amount * adjust)
    this.velocityY += Trig.calculateVertical(direction, amount * adjust)

    if (maxVelocity) {
      let velocity = Trig.calculateDistance(this.velocityX, this.velocityY)
      if (velocity >= maxVelocity) {
        let adjustment = maxVelocity / velocity
        this.velocityX *= adjustment
        this.velocityY *= adjustment
      }
    }
  }

  /**
   * Apply an instant velocity change from a ricochet with the given node.
   */
  ricochet(that, amount, maxVelocity, dt) {
    let direction =
      Math.PI +
      Trig.calculateAngle(
        this.offsetX,
        this.offsetY,
        that.offsetX,
        that.offsetY
      )
    this.accelerate(direction, amount, maxVelocity, dt)
  }

  /**
   * Move the node based on its current velocity. If the node leaves the edge
   * of the screen, calls the leave event.
   */
  tick(dt, stage) {
    super.tick(dt, stage)

    // Spin the node based on its angular momentum
    this.rotateBy(this.spin, dt)

    // Move the node based on its current velocity on every tick
    this.moveBy(this.velocityX, this.velocityY, dt)

    // Check if the node has disappeared off the screen
    let rightEdge = this.getRightEdge(stage)
    let bottomEdge = this.getBottomEdge(stage)
    if (this.offsetX >= rightEdge) {
      this.leave.emit('right')
    } else if (this.offsetX <= -rightEdge) {
      this.leave.emit('left')
    }
    if (this.offsetY >= bottomEdge) {
      this.leave.emit('bottom')
    } else if (this.offsetY <= -bottomEdge) {
      this.leave.emit('top')
    }
  }
}
