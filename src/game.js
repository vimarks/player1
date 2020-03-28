import Stage from 'stage-js/platform/web'
import constants from './constants.js'
import { Node } from './node.js'
import { Input } from './input.js'
import { Shuttle } from './shuttle.js'
import { RockMaker } from './rock.js'
import { Timer } from './timer.js'

export class Game extends Node {
  constructor() {
    super(Stage.create())
  }

  start(stage) {
    super.start(stage)

    let game = this.node
    let input = new Input()
    let rockMaker = new RockMaker()
    let shuttle = new Shuttle(rockMaker, input.source)
    let timer = new Timer(constants.initTimeLimit, shuttle)

    // Initialize input events
    input.start(game)

    // Initialize the shuttle, rocks, & timer
    shuttle.start(game)
    rockMaker.start(game)
    timer.start(game)

    // Initialize the screen
    stage.background(constants.backgroundColor)
    stage.on('viewport', viewport => {
      game.pin({ align: 0.5 })
      game.size(constants.viewbox.width, constants.viewbox.height)
      this.scaleScreen(game, viewport)
    })
  }

  scaleScreen(game, viewport) {
    let gameRatio = game.width() / game.height()
    let viewportRatio = viewport.width / viewport.height

    if (gameRatio > viewportRatio) {
      // Screen is taller than the game
      game.pin({
        scaleWidth: viewport.width,
        scaleHeight: viewport.width / gameRatio,
      })
    } else {
      // Screen is wider than the game
      game.pin({
        scaleWidth: viewport.height * gameRatio,
        scaleHeight: viewport.height,
      })
    }
  }
}
