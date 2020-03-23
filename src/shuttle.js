import Stage from 'stage-js/platform/web'
import { constants } from './constants.js'
import { Actions } from './actions.js'
import { Bullet } from './bullet.js'
import { Moving } from './moving.js'
import * as Trig from './trig.js'

export class Shuttle extends Moving {
  constructor(rockMaker, source) {
    // Initialize with the 'shuttle' image at the center of the screen
    let node = Stage.image('shuttle')
    super(node)

    this.reloading = false
    this.rockMaker = rockMaker
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

    // Listen for events we care about
    this.actions.start(stage)

    // Fire a bullet on the 'fire' action
    this.actions.on('fire', when => this.fireBullet(stage, when))

    // Spin the shuttle on the 'turnLeft' and 'turnRight' actions
    this.actions.on('turnLeft', () => this.turnLeft())
    this.actions.onClear('turnLeft', () => this.turnRight())
    this.actions.on('turnRight', () => this.turnRight())
    this.actions.onClear('turnRight', () => this.turnLeft())
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

    // continually check if any on-screen rock is touching the shuttle
    let rockSet = this.rockMaker.rockSet
    for (let n of rockSet) {
      if (this.collisionDetection(n)) {
        this.node.remove()
        let explosion = new Explode(this.offsetX, this.offsetY)
        explosion.start(stage)
      }
    }
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

export class Explode extends Moving {
  constructor(offsetX, offsetY) {
    let node = Stage.anim('explosion')
    super(node, offsetX, offsetY)
  }
  start(stage) {
    super.start(stage)
    this.node.play()
    console.log('start')
  }
}
