import { constants } from "./constants.js";
import { Node } from "./node.js";
import * as Trig from "./trig.js";

/**
 * Base class extending Node with the ability to move around the screen.
 */
export class Moving extends Node {
  constructor(imageName, offsetX, offsetY, rotation, velocityX, velocityY) {
    super(imageName, offsetX, offsetY, rotation);
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }
  /**
   * Gets the X-coordinate where the node disappears off the screen.
   */
  getRightEdge(stage) {
    let nodeWidth = this.node.pin("width");
    let stageWidth = stage.pin("width");
    return (nodeWidth + stageWidth) / 2;
  }

  /**
   * Gets the Y-coordinate where the node disappears off the screen.
   */
  getBottomEdge(stage) {
    let nodeHeight = this.node.pin("height");
    let stageHeight = stage.pin("height");
    return (nodeHeight + stageHeight) / 2;
  }

  /**
   * Moves the node relative to its current position, adjusted for framerate.
   */
  moveBy(xAmount, yAmount, dt) {
    let adjustedDt = dt * constants.dtCoefficient;
    let relOffsetX = xAmount ? xAmount * adjustedDt : 0;
    let relOffsetY = yAmount ? yAmount * adjustedDt : 0;
    this.moveTo(this.offsetX + relOffsetX, this.offsetY + relOffsetY);
  }

  /**
   * Rotates the node relative to its current angle, adjusted for framerate.
   */
  rotateBy(amount, dt) {
    let adjustedDt = dt * constants.dtCoefficient;
    let relRotation = amount ? amount * adjustedDt : 0;
    this.rotateTo(this.rotation + relRotation);
  }

  /**
   * Update the velocity of the node based on an acceleration amount and
   * direction, adjusted for framerate. If maxVelocity is given, the node
   * cannot accelerate faster than that value.
   */
  accelerate(rotation, amount, maxVelocity, dt) {
    let adjustedDt = dt * constants.dtCoefficient;
    this.velocityX += Trig.calculateHorizontal(rotation, amount * adjustedDt);
    this.velocityY += Trig.calculateVertical(rotation, amount * adjustedDt);

    if (maxVelocity) {
      let velocity = Trig.calculateDistance(this.velocityX, this.velocityY);
      if (velocity >= maxVelocity) {
        let adjustment = maxVelocity / velocity;
        this.velocityX *= adjustment;
        this.velocityY *= adjustment;
      }
    }
  }

  /**
   * Move the node based on its current velocity. If the node leaves the edge
   * of the screen, calls the appropriate onLeave*() callback.
   */
  tick(dt, stage) {
    super.tick(dt, stage);

    // Move the node based on its current velocity on every tick
    this.moveBy(this.velocityX, this.velocityY, dt);

    // Check if the node has disappeared off the screen
    let rightEdge = this.getRightEdge(stage);
    let bottomEdge = this.getBottomEdge(stage);
    if (this.offsetX >= rightEdge) {
      this.onLeaveRight();
    } else if (this.offsetX <= -rightEdge) {
      this.onLeaveLeft();
    }
    if (this.offsetY >= bottomEdge) {
      this.onLeaveBottom();
    } else if (this.offsetY <= -bottomEdge) {
      this.onLeaveTop();
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
