import constants from '../constants.js'
import { Event } from '../event.js'
import sounds from './sounds.js'
import { Input } from './input.js'
import { State } from './state.js'
import { Collisions } from './collision.js'
import { Shuttle } from './shuttle.js'
import { Timer } from './timer.js'
import { Vault } from './vault.js'
import { StarField } from './star.js'

export class Game {
  start(stage) {
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

    // Initialize the stars
    let starField = new StarField()
    starField.start(stage)

    // Initialize the shuttle
    let shuttle = state.shuttleSet.add()
    input.triggerUntil(shuttle.remove, shuttle.input)

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
      .detect(state.rockSet, state.projectileSet)
      .triggerLeft(rock => rock.shoot)
      .triggerRight(projectile => projectile.remove)

    collisions
      .detect([shuttle], state.crystalSet)
      .trigger(timer.extendTimer)
      .trigger(vault.bankCrystal)
      .trigger(sounds.crystalCapture)
      .triggerRight(crystal => crystal.remove)

    shuttle.cannon.fire.on(row => state.projectileSet.add(row))

    collisions
      // returns a new group(leftSet, rightSet)
      // when an object from either set touches, an event is emited
      .detect([shuttle], state.powerupSet)
      .triggerLeft(shuttle => shuttle.cannon.arm)
      .trigger(sounds.powerupCapture)
      .triggerRight(powerup => powerup.remove)

    // Initialize the screen
    stage.background(constants.backgroundColor)
    stage.viewbox(constants.viewbox.width, constants.viewbox.height, 'in')
  }
}
