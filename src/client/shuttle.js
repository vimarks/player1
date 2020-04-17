import constants from '../constants.js'
import * as Trig from '../trig.js'
import { Event } from '../event.js'
import sounds from './sounds.js'
import { Actions } from './actions.js'
import { Bullet } from './bullet.js'
import { Moving } from './moving.js'
import { Node } from './node.js'

export class Shuttle extends Moving {
  constructor({}) {
    // Initialize with the 'shuttle' image at the center of the screen
    super(Stage.image('shuttle'))
    this.fire = new Event()
    this.input = new Event()
    this.actions = new Actions([
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

    // Input will trigger actions and cause a sync
    this.input.trigger(this.actions).trigger(this.sync, 'input')
    this.broker.topic('input').trigger(this.actions)

    // Fire a bullet on the 'fire' action
    this.actions.fire.on(() => this.handleFire())

    // Spin the shuttle on the 'turnLeft' and 'turnRight' actions
    this.actions.turnLeft.on(() => this.turnLeft())
    this.actions.turnLeft.clear.on(() => this.turnRight())
    this.actions.turnRight.on(() => this.turnRight())
    this.actions.turnRight.clear.on(() => this.turnLeft())

    // Explode on removal
    this.remove.on(() => this.explode(stage))
  }

  tick(dt, stage) {
    super.tick(dt, stage)

    // Rotate the shuttle towards the focus point, unless already turning
    if (this.actions.focus.active && this.spin === 0) {
      let focusAngle = this.getFocusAngle(this.actions.focus.value)
      let focusDiff = Trig.diffAngles(this.rotation, focusAngle)
      this.rotateBy(focusDiff * constants.shuttleRotation, dt)
    }

    // Engage thrusters with the 'accelerate' action
    if (this.actions.accelerate.active) {
      this.accelerate(
        this.rotation,
        constants.shuttleAcceleration,
        constants.shuttleMaxVelocity,
        dt
      )
    }
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

  handleFire() {
    // Emit a fire event with the shuttle location and rotation
    this.fire.emit({
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
    })
  }

  save(stage, row) {
    super.save(stage, row)
    row.offsetX = this.offsetX
    row.offsetY = this.offsetY
    row.rotation = this.rotation
    row.velocityX = this.velocityX
    row.velocityY = this.velocityY
  }

  load(stage, row) {
    super.load(stage, row)
    this.moveTo(row.offsetX, row.offsetY)
    this.rotateTo(row.rotation)
    this.velocityX = row.velocityX
    this.velocityY = row.velocityY
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
