import * as Trig from "./trig.js";

/**
 * Base class of anything that is drawn on the screen. The node
 * is rendered at a location with a direction.
 */
export class Node {
  constructor(imageName, offsetX, offsetY, rotation) {
    this.node = Stage.image(imageName);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.rotation = rotation;
  }

  start(stage) {
    // Add the node to the parent node
    this.node.appendTo(stage);

    // Set the node's pinned location and rotation values
    this.node.pin({
      align: 0.5,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation
    });

    // Register the tick method
    this.node.tick(dt => this.tick(dt, stage));
  }

  tick(dt, stage) {
    // Override if needed
  }

  /**
   * Updates the absolute position of the node to new coordinates.
   */
  moveTo(newOffsetX, newOffsetY) {
    this.offsetX = newOffsetX;
    this.offsetY = newOffsetY;
    this.node.pin({
      offsetX: newOffsetX,
      offsetY: newOffsetY
    });
  }

  /**
   * Updates the absolute rotation of the node to a new angle.
   */
  rotateTo(newRotation) {
    this.rotation = Trig.normalizeAngle(newRotation);
    this.node.pin("rotation", newRotation);
  }
}
