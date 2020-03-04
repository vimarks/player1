import { constants } from './constants.js'
import { Node } from './node.js'

let twoPi = 2 * Math.PI

export class Moving extends Node {
  constructor(state, imageName, offsetX, offsetY, rotation, velocityX, velocityY) {
    super(state, imageName, offsetX, offsetY, rotation)
    this.velocityX = velocityX
    this.velocityY = velocityY
  }

  get rightEdge() {
    return this.state.getRightEdge(this.node)
  }

  get bottomEdge() {
    return this.state.getBottomEdge(this.node)
  }

  moveTo(newOffsetX, newOffsetY) {
    this.offsetX = newOffsetX
    this.offsetY = newOffsetY
    this.node.pin({
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    })
  }

  moveBy(xAmount, yAmount, dt) {
    let adjustedDt = dt * constants.dtCoefficient
    let relOffsetX = xAmount * adjustedDt
    let relOffsetY = yAmount * adjustedDt
    this.moveTo(this.offsetX + relOffsetX, this.offsetY + relOffsetY)
  }

  rotateTo(newRotation) {
    this.rotation = newRotation
    if (this.rotation > twoPi) {
      this.rotation -= twoPi
    } else if (this.rotation < -twoPi) {
      this.rotation += twoPi
    }
    this.node.pin('rotation', newRotation)
  }

  rotateBy(amount, dt) {
    let relRotation = amount * dt * constants.dtCoefficient
    this.rotateTo(this.rotation + relRotation)
  }

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

  tick(dt, stage) {
    super.tick(dt, stage)

    this.moveBy(this.velocityX, this.velocityY, dt)

    let rightEdge = this.state.getRightEdge(this.node)
    let bottomEdge = this.state.getBottomEdge(this.node)
    if (this.offsetX >= rightEdge) {
      this.onLeaveRight()
    } else if (this.offsetX <= -rightEdge) {
      this.onLeaveLeft()
    }
    if (this.offsetY >= bottomEdge) {
      this.onLeaveBottom()
    } else if (this.offsetY <= -bottomEdge) {
      this.onLeaveTop()
    }
  }

  onLeaveLeft() {
  }

  onLeaveRight() {
  }

  onLeaveTop() {
  }

  onLeaveBottom() {
  }
}
