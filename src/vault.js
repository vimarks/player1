import Stage from 'stage-js/platform/web'
import { Node } from './node.js'
import { Event } from './event.js'

export class Vault extends Node {
  constructor(balance) {
    super(Stage.string('text'))
    this.balance = balance
    this.bankCrystal = new Event()
  }

  append(stage) {
    // Position the balance in the entire window, not just the game box
    stage.append(this.node)
  }

  start(stage) {
    super.start(stage)
    this.node.pin({ alignY: 0.95 })

    this.bankCrystal.on(() => this.updateBalance())
  }

  updateBalance() {
    this.node.value(`crystals: ${(this.balance += 1)}`)
  }
}
