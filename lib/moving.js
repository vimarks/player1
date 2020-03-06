import { constants } from './constants.js'
import { Node } from './node.js'

let twoPi = 2 * Math.PI

/**
 * Base class extending Node with the ability to move around the screen.
 */
export class Moving extends Node {
  constructor(state, imageName, offsetX, offsetY, rotation, velocityX, velocityY) {
    super(state, imageName, offsetX, offsetY, rotation)
    this.velocityX = velocityX
    this.velocityY = velocityY
  }

  /**
   * Gets the X-coordinate where the node disappears off the screen.
   */
  get rightEdge() {
    return this.state.getRightEdge(this.node)
  }

  /**
   * Gets the Y-coordinate where the node disappears off the screen.
   */
  get bottomEdge() {
    return this.state.getBottomEdge(this.node)
  }

  /**
   * Updates the absolute position of the node to new coordinates.
   */
  moveTo(newOffsetX, newOffsetY) {
    this.offsetX = newOffsetX
    this.offsetY = newOffsetY
    this.node.pin({
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    })
  }

  /**
   * Moves the node relative to its current position, adjusted for framerate.
   */
  moveBy(xAmount, yAmount, dt) {
    let adjustedDt = dt * constants.dtCoefficient
    let relOffsetX = xAmount * adjustedDt
    let relOffsetY = yAmount * adjustedDt
    this.moveTo(this.offsetX + relOffsetX, this.offsetY + relOffsetY)
  }

  /**
   * Updates the absolute rotation of the node to a new angle.
   */
  rotateTo(newRotation) {
    this.rotation = newRotation
    if (this.rotation > twoPi) {
      this.rotation -= twoPi
    } else if (this.rotation < -twoPi) {
      this.rotation += twoPi
    }
    this.node.pin('rotation', newRotation)
  }

  /**
   * Rotates the node relative to its current angle, adjusted for framerate.
   */
  rotateBy(amount, dt) {
    let relRotation = amount * dt * constants.dtCoefficient
    this.rotateTo(this.rotation + relRotation)
  }

  /**
   * Update the velocity of the node based on an acceleration amount and
   * direction, adjusted for framerate. If maxVelocity is given, the node
   * cannot accelerate faster than that value.
   */
  accelerate(rotation, amount, maxVelocity, dt) {
    let adjustedDt = dt * constants.dtCoefficient
    this.velocityX += Math.sin(rotation) * amount * adjustedDt
    this.velocityY -= Math.cos(rotation) * amount * adjustedDt

    if (maxVelocity) {
      let velocity = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY)
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

    // Move the node based on its current velocity on every tick
    this.moveBy(this.velocityX, this.velocityY, dt)

    // Check if the node has disappeared off the screen
    if (this.offsetX >= this.rightEdge) {
      this.onLeaveRight()
    } else if (this.offsetX <= -this.rightEdge) {
      this.onLeaveLeft()
    }
    if (this.offsetY >= this.bottomEdge) {
      this.onLeaveBottom()
    } else if (this.offsetY <= -this.bottomEdge) {
      this.onLeaveTop()
    }
  }

  onLeaveLeft() {
    // Override if needed
  }

  onLeaveRight() {
    // Override if needed
  }

  onLeaveTop() {
    // Override if needed
  }

  onLeaveBottom() {
    // Override if needed
  }
}
