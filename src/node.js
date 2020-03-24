import * as Trig from './trig.js'

/**
 * Base class of anything that is drawn on the screen. The node
 * is rendered at a location with a direction.
 */
export class Node {
  constructor(node, offsetX = 0, offsetY = 0, rotation = 0, scale = 1) {
    this.node = node
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.rotation = rotation
    this.scale = scale
    this.removeCallbacks = new Set()
  }

  start(stage) {
    // Add the node to the parent node
    this.node.appendTo(stage)

    // Set the node's pinned location, rotation, and scale values
    this.node.pin({
      align: 0.5,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation,
      scale: this.scale,
    })

    // Register the tick method
    this.node.tick(dt => this.tick(dt, stage))
  }

  tick(dt, stage) {
    // Override if needed
  }

  /**
   * Simulate a radius property based on the width and scale of the node.
   */
  get radius() {
    return (this.node.width() * this.node.pin('scaleX')) / 2
  }

  /**
   * Detect collision between this node and another.
   */
  collisionDetection(other) {
    let d = Trig.calculateDistance(
      this.offsetX,
      this.offsetY,
      other.offsetX,
      other.offsetY
    )
    return d <= this.radius + other.radius
  }

  /**
   * Remove the node from the screen and perform any additional cleanup.
   */
  remove() {
    this.node.remove()
    this.removeCallbacks.forEach(cb => cb(this))
  }

  /**
   * Register a callback for when the object is removed.
   */
  onRemove(callback) {
    this.removeCallbacks.add(callback)
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
   * Updates the absolute rotation of the node to a new angle.
   */
  rotateTo(newRotation) {
    this.rotation = Trig.normalizeAngle(newRotation)
    this.node.pin('rotation', newRotation)
  }

  /**
   * Updates the scale ratio of the node.
   */
  scaleTo(newScale) {
    this.scale = newScale
    this.node.pin('scale', newScale)
  }
}
