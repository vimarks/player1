import Stage from 'stage-js/platform/web'
import constants from './constants.js'
import sounds from './sounds.js'
import { Event } from './event.js'
import { Node } from './node.js'
import { Input } from './input.js'
import { Collisions } from './collision.js'
import { Shuttle } from './shuttle.js'
import { RockMaker } from './rock.js'
import { CrystalMaker } from './crystal.js'
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

    let input = new Input()
    let collisions = new Collisions()
    let rockMaker = new RockMaker()
    let crystalMaker = new CrystalMaker()
    let timer = new Timer(constants.initTimeLimit)
    let vault = new Vault(constants.initBalance)
    let shuttle = new Shuttle(input.source)
    let gameOver = new Event()

    // Initialize game mechanics
    input.start(stage)
    rockMaker.start(stage)
    crystalMaker.start(stage)
    timer.start(stage)
    vault.start(stage)
    collisions.start(stage)
    shuttle.start(stage)

    // Initialize the events
    gameOver
      .trigger(shuttle.remove)
      .trigger(vault.showEndBalance)
      .trigger(timer.showTotalTime)

    timer.expire.trigger(gameOver)

    collisions
      .detect([shuttle], rockMaker.rockSet)
      .trigger(sounds.explosion)
      .trigger(gameOver)

    collisions
      .detect(rockMaker.rockSet, shuttle.bulletSet)
      .triggerLeft(rock => rock.shoot)
      .triggerRight(bullet => bullet.remove)

    collisions
      .detect([shuttle], crystalMaker.crystalSet)
      .trigger(timer.extendTimer)
      .trigger(vault.bankCrystal)
      .trigger(sounds.crystalCapture)
      .triggerRight(crystal => crystal.remove)

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
