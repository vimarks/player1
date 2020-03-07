import { constants } from './constants.js'
import { Shuttle } from './shuttle.js'
import { Rock } from './rock.js'

/**
 * Manages the game state.
 */
export class State {
  constructor(activeKeys) {
    this.shuttle = new Shuttle(this, activeKeys)
    this.rock = new Rock(this)
  }

  /**
   * Start the game state, before the first tick function runs.
   */
  start(stage) {
    // If the window is resized, update the viewbox
    stage.on('viewport', viewport => this.updateViewbox(stage, viewport))

    // Initialize the shuttle
    this.shuttle.start(stage)

    this.rock.start(stage)
  }

  /**
   * Scale the viewbox based on the browser window size.
   */
  updateViewbox(stage, viewport) {
    let aspectRatio = viewport.width / viewport.height
    let width = this.viewboxWidth = aspectRatio * constants.viewboxHeight
    let height = this.viewboxHeight = constants.viewboxHeight
    stage.viewbox(width, height, 'in-pad')
  }

  /**
   * Given a node, calculate the X-coordinate where the node will
   * no longer be visible on the screen.
   */
  getRightEdge(node) {
    return (node.pin('width') + this.viewboxWidth) / 2
  }

  /**
   * Given a node, calculate the Y-coordinate where the node will
   * no longer be visible on the screen.
   */
  getBottomEdge(node) {
    return (node.pin('height') + this.viewboxHeight) / 2
  }
}
