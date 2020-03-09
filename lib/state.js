import { constants } from "./constants.js";
import { Shuttle } from "./shuttle.js";

/**
 * Manages the game state.
 */
export class State {
  constructor(activeKeys) {
    this.shuttle = new Shuttle(activeKeys);
  }

  /**
   * Start the game state, before the first tick function runs.
   */
  start(stage) {
    // If the window is resized, update the viewbox
    stage.on("viewport", viewport => this.updateViewbox(stage, viewport));

    // Initialize the shuttle
    this.shuttle.start(stage);
  }

  /**
   * Scale the viewbox based on the browser window size.
   */
  updateViewbox(stage, viewport) {
    let aspectRatio = viewport.width / viewport.height;
    let width = aspectRatio * constants.viewboxHeight;
    let height = constants.viewboxHeight;
    stage.viewbox(width, height);
  }
}
