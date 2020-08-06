import * as Trig from '../trig.js'
import { Event } from '../event.js'

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
    this.remove = new Event()
    this.broker = new Event()
    this.sync = new Event()
  }

  append(stage) {
    // Add the node to the parent node
    stage.append(this.node)
  }

  start(stage) {
    this.append(stage)

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

    // Remove the node from the stage
    this.remove.on(() => this.node.remove())
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
   * Check if the node is currently visible on-screen.
   */
  get visible() {
    return this.node.parent() != null
  }

  /**
   * Detect collision between this node and another.
   */
  touching(that) {
    let radiusSum = this.radius + that.radius
    if (
      !this.visible ||
      !that.visible ||
      Math.abs(this.offsetX - that.offsetX) > radiusSum ||
      Math.abs(this.offsetY - that.offsetY) > radiusSum
    ) {
      return false
    } else {
      let d = Trig.calculateDistance(
        this.offsetX,
        this.offsetY,
        that.offsetX,
        that.offsetY
      )
      return d <= radiusSum
    }
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

  /**
   * Save updated state from the node to a row.
   */
  save(stage, row) {
    // Only updatable properties should be saved
  }

  /**
   * Load updated state from a row into the node.
   */
  load(stage, row, when) {
    // Only updatable properties should be loaded
  }
}
