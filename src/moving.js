import { constants } from './constants.js'
import { Node } from './node.js'
import * as Trig from './trig.js'

/**
 * Base class extending Node with the ability to move around the screen.
 */
export class Moving extends Node {
  constructor(
    imageName,
    offsetX,
    offsetY,
    rotation,
    velocityX = 0,
    velocityY = 0,
    spin = 0
  ) {
    super(imageName, offsetX, offsetY, rotation)
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.spin = spin
  }

  /**
   * Gets the X-coordinate where the node disappears off the screen.
   */
  getRightEdge(stage) {
    return (this.node.width() + stage.width()) / 2
  }

  /**
   * Gets the Y-coordinate where the node disappears off the screen.
   */
  getBottomEdge(stage) {
    return (this.node.height() + stage.height()) / 2
  }

  /**
   * Moves the node relative to its current position, adjusted for framerate.
   */
  moveBy(xAmount, yAmount, dt) {
    let adjustedDt = dt * constants.dtCoefficient
    let relOffsetX = xAmount ? xAmount * adjustedDt : 0
    let relOffsetY = yAmount ? yAmount * adjustedDt : 0
    if (relOffsetX !== 0 || relOffsetY !== 0) {
      this.moveTo(this.offsetX + relOffsetX, this.offsetY + relOffsetY)
    }
  }

  /**
   * Rotates the node relative to its current angle, adjusted for framerate.
   */
  rotateBy(amount, dt) {
    let adjustedDt = dt * constants.dtCoefficient
    let relRotation = amount ? amount * adjustedDt : 0
    if (relRotation !== 0) {
      this.rotateTo(this.rotation + relRotation)
    }
  }

  /**
   * Update the velocity of the node based on an acceleration amount and
   * direction, adjusted for framerate. If maxVelocity is given, the node
   * cannot accelerate faster than that value.
   */
  accelerate(rotation, amount, maxVelocity, dt) {
    let adjustedDt = dt * constants.dtCoefficient
    this.velocityX += Trig.calculateHorizontal(rotation, amount * adjustedDt)
    this.velocityY += Trig.calculateVertical(rotation, amount * adjustedDt)

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
   * Move the node based on its current velocity. If the node leaves the edge
   * of the screen, calls the appropriate onLeave*() callback.
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
      this.onLeave('right')
    } else if (this.offsetX <= -rightEdge) {
      this.onLeave('left')
    }
    if (this.offsetY >= bottomEdge) {
      this.onLeave('bottom')
    } else if (this.offsetY <= -bottomEdge) {
      this.onLeave('top')
    }
  }

  /**
   * Called when the node has moved completely off-screen, with the side of the
   * screen where the node left ('top', 'bottom', 'left', 'right').
   */
  onLeave(side) {
    // Override if needed
  }
}
