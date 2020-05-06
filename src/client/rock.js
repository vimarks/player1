import constants from '../constants.js'
import { randRange } from '../rand.js'
import { Event } from '../event.js'
import { Moving } from './moving.js'

export class Rock extends Moving {
  constructor({ side, offsetX, offsetY, scale, velocityX, velocityY }) {
    let rotation = randRange(0, 2 * Math.PI)
    let spin = randRange(-constants.rockSpinSpeed, constants.rockSpinSpeed)
    let node = Stage.image('rock')
    super(node, offsetX, offsetY, rotation, scale, velocityX, velocityY, spin)
    this.side = side
    this.shoot = new Event()
  }

  start(stage) {
    super.start(stage)
    this.leave.on(side => this.onLeave(side))
    this.shoot
      .on(projectile => this.ricochet(projectile, constants.rockRicochet, 0))
      .trigger(this.sync, null)
  }

  onLeave(side) {
    if (side !== this.side) {
      this.remove.emit()
    }
  }

  save(stage, row) {
    super.save(stage, row)
    row.offsetX = this.offsetX
    row.offsetY = this.offsetY
    row.velocityX = this.velocityX
    row.velocityY = this.velocityY
  }

  load(stage, row, when) {
    super.load(stage, row, when)
    let age = when - row.mod
    this.moveTo(row.offsetX, row.offsetY)
    this.velocityX = row.velocityX
    this.velocityY = row.velocityY
    this.tick(age, stage)
  }
}
