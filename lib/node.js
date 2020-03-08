/**
 * Base class of anything that is drawn on the screen. The node
 * is rendered at a location with a direction.
 */
export class Node {
  constructor(state, imageName, offsetX, offsetY, rotation) {
    this.state = state;
    this.node = Stage.image(imageName);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.rotation = rotation;
  }

  start(parentNode) {
    // Add the node to the parent node
    this.node.appendTo(parentNode);

    // Set the node's pinned location and rotation values
    this.node.pin({
      align: 0.5,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation
    });

    // Register the tick method
    this.node.tick(dt => this.tick(dt, parentNode));
  }

  tick(dt, stage) {
    // Override if needed
  }
}
