
export class Node {
  constructor(state, imageName, offsetX, offsetY, rotation) {
    this.state = state
    this.node = Stage.image(imageName)
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.rotation = rotation
  }

  start(stage) {
    this.node.appendTo(stage)
    this.node.pin({
      align: 0.5,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation,
    })
  }

  tick(dt, stage) {
  }
}
