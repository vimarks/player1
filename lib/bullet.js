import { constants } from './constants.js'

export class Bullet {
  constructor(state, offsetX, offsetY, rotation, velocityX, velocityY) {
    this.state = state
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.rotation = rotation
    this.velocityX = velocityX + Math.sin(rotation) * constants.bulletVelocity
    this.velocityY = velocityY + -Math.cos(rotation) * constants.bulletVelocity
    this.node = Stage.image('bullet')
  }

  start(stage) {
    this.node.appendTo(stage)
    this.node.pin({
      align: 0.5,
      rotation: this.rotation,
    })
  }

  tick(dt, stage) {
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
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation
    })
  }
}
