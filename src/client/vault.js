import { Event } from '../event.js'
import { Text } from './text.js'

export class Vault extends Text {
  constructor(balance = 0) {
    super({ alignY: 0.95 })
    this.balance = balance
    this.bankCrystal = new Event()
    this.showEndBalance = new Event()
  }

  start(stage) {
    super.start(stage)
    this.bankCrystal.on(() => this.updateBalance())
    this.showEndBalance.on(() => this.displayEndBalance())
  }

  updateBalance() {
    this.value = `crystals:  ${(this.balance += 1)}`
  }

  displayEndBalance() {
    this.value = `crystals collected: ${this.balance}`
    this.node.scale(1.5)
    this.node.pin({ alignY: 0.45 })
  }
}
