import Stage from 'stage-js/platform/web'
import constants from './constants.js'
import { Actions } from './actions.js'
import { Bullet } from './bullet.js'
import { Moving } from './moving.js'
import { Node } from './node.js'
import * as Trig from './trig.js'

export class Shuttle extends Moving {
  constructor(source) {
    // Initialize with the 'shuttle' image at the center of the screen
    super(Stage.image('shuttle'))
    this.bulletSet = new Set()
    this.reloading = false
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

    // Listen for actions we care about
    this.actions.start(stage)

    // Fire a bullet on the 'fire' action
    this.actions.on('fire', when => this.fireBullet(stage, when))

    // Spin the shuttle on the 'turnLeft' and 'turnRight' actions
    this.actions.on('turnLeft', () => this.turnLeft())
    this.actions.onClear('turnLeft', () => this.turnRight())
    this.actions.on('turnRight', () => this.turnRight())
    this.actions.onClear('turnRight', () => this.turnLeft())

    // Listen for events
    this.node.on('event.explode', () => this.explode(stage))
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

  explode(stage) {
    this.node.remove()
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
    bullet.onRemove(() => this.bulletSet.delete(bullet))

    // Start the bullet, relative to the same parent node as the shuttle,
    // so that the shuttle movement does not affect the bullet.
    bullet.start(stage)
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
    this.node.repeat(1, () => this.remove())
  }
}
