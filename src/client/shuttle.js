import constants from '../constants.js'
import { Event } from '../event.js'
import * as Trig from '../trig.js'
import sounds from './sounds.js'
import { Actions } from './actions.js'
import { Cannon } from './cannon.js'
import { Bullet } from './bullet.js'
import { Moving } from './moving.js'
import { Node } from './node.js'

export class Shuttle extends Moving {
  constructor(source) {
    // Initialize with the 'shuttle' image at the center of the screen
    super(Stage.image('shuttle'))
    this.cannon = new Cannon(this)
    this.bulletSet = new Set()
    this.actions = new Actions(this.node, source, [
      'fire',
      'focus',
      'turnLeft',
      'turnRight',
      'accelerate',
    ])
  }

  start(stage) {
    super.start(stage)
    this.leave.on(side => this.onLeave(side))

    // Listen for actions we care about
    this.actions.start(stage)

    // Fire a bullet on the 'fire' action
    this.actions.on('fire', () => this.fire())
    this.cannon.start(stage)

    // Spin the shuttle on the 'turnLeft' and 'turnRight' actions
    this.actions.on('turnLeft', () => this.turnLeft())
    this.actions.onClear('turnLeft', () => this.turnRight())
    this.actions.on('turnRight', () => this.turnRight())
    this.actions.onClear('turnRight', () => this.turnLeft())

    // Explode on removal
    this.remove.on(() => this.explode(stage))
  }

  tick(dt, stage) {
    super.tick(dt, stage)

    // Rotate the shuttle towards the focus point, unless already turning
    if (this.actions.focus && this.spin === 0) {
      let focusAngle = this.getFocusAngle(this.actions.focus)
      let focusDiff = Trig.diffAngles(this.rotation, focusAngle)
      this.rotateBy(focusDiff * constants.shuttleRotation, dt)
    }

    // Engage thrusters with the 'accelerate' action
    if (this.actions.accelerate) {
      this.accelerate(
        this.rotation,
        constants.shuttleAcceleration,
        constants.shuttleMaxVelocity,
        dt
      )
    }
  }

  fire() {
    this.cannon.fire.emit(this)
  }

  explode(stage) {
    let explosion = new Explode(this.offsetX, this.offsetY)
    explosion.start(stage)
  }

  turnLeft() {
    // Adjust spin counter-clockwise
    this.spin -= constants.shuttleRotation
  }

  turnRight() {
    // Adjust spin clockwise
    this.spin += constants.shuttleRotation
  }

  /**
   * Calculate the angle between the shuttle position and the focus point.
   */
  getFocusAngle(focusPoint) {
    return Trig.calculateAngle(
      this.offsetX,
      this.offsetY,
      focusPoint.x,
      focusPoint.y
    )
  }

  fireBullet(stage, when) {
    // Create the bullet relative to the shuttle location and rotation
    let bullet = new Bullet(
      this.offsetX,
      this.offsetY,
      this.rotation,
      this.velocityX,
      this.velocityY
    )

    this.bulletSet.add(bullet)
    bullet.remove.on(() => this.bulletSet.delete(bullet))

    // Start the bullet, relative to the same parent node as the shuttle,
    // so that the shuttle movement does not affect the bullet.
    this.visible && bullet.start(stage)
    sounds.shootLaser.emit()
  }

  /**
   * When the shuttle leaves the screen, wrap it around vertically or
   * horizontally.
   */
  onLeave(side) {
    if (side === 'top' || side === 'bottom') {
      this.moveTo(this.offsetX, -this.offsetY)
    } else if (side === 'left' || side === 'right') {
      this.moveTo(-this.offsetX, this.offsetY)
    }
  }
}

export class Explode extends Node {
  constructor(offsetX, offsetY) {
    let node = Stage.anim('explosion')
    super(node, offsetX, offsetY)
  }

  start(stage) {
    super.start(stage)
    this.node.repeat(1, () => this.remove.emit())
  }
}
