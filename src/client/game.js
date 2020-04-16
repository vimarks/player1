import constants from '../constants.js'
import { Event } from '../event.js'
import sounds from './sounds.js'
import { Node } from './node.js'
import { Input } from './input.js'
import { State } from './state.js'
import { Collisions } from './collision.js'
import { Shuttle } from './shuttle.js'
import { Timer } from './timer.js'
import { Vault } from './vault.js'

export class Game extends Node {
  constructor() {
    super(Stage.create())
  }

  append(stage) {
    // This node should always be stage.first()
    stage.prepend(this.node)
  }

  start(stage) {
    super.start(stage)

    let gameOver = new Event()
    let input = new Input()
    let collisions = new Collisions()
    let timer = new Timer(constants.initTimeLimit)
    let vault = new Vault(constants.initBalance)
    let state = new State(constants.serverUrl)

    // Initialize game mechanics
    input.start(stage)
    timer.start(stage)
    vault.start(stage)
    collisions.start(stage)
    state.start(stage)

    // Initialize the shuttle
    let shuttle = state.shuttleSet.add()
    input.triggerUntil(shuttle.remove, shuttle.actions)

    // Initialize the events
    gameOver
      .trigger(shuttle.remove)
      .trigger(vault.showEndBalance)
      .trigger(timer.showTotalTime)

    timer.expire.trigger(gameOver)

    collisions
      .detect([shuttle], state.rockSet)
      .trigger(sounds.explosion)
      .trigger(gameOver)

    collisions
      .detect(state.rockSet, state.bulletSet)
      .triggerLeft(rock => rock.shoot)
      .triggerRight(bullet => bullet.remove)

    collisions
      .detect([shuttle], state.crystalSet)
      .trigger(timer.extendTimer)
      .trigger(vault.bankCrystal)
      .trigger(sounds.crystalCapture)
      .triggerRight(crystal => crystal.remove)

    shuttle.fire.on(row => state.bulletSet.add(row))

    // Initialize the screen
    this.node.size(constants.viewbox.width, constants.viewbox.height)
    this.node.pin({ align: 0.5 })
    stage.background(constants.backgroundColor)
    stage.on('viewport', viewport => this.scaleScreen(stage, viewport))
  }

  scaleScreen(stage, viewport) {
    let game = this.node
    let gameRatio = game.width() / game.height()
    let viewportRatio = viewport.width / viewport.height

    // The stage should take up the whole window
    stage.size(viewport.width, viewport.height)

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
