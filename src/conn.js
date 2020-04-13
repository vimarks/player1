import { Event } from './event.js'
import { elapsed } from './time.js'

/**
 * A single message sent from client to server or server to client.
 */
export class Message {
  constructor({ when = elapsed(), changes = [] }) {
    this.when = when
    this.changes = changes
  }
}

/**
 * Connection object, containing socket events.
 */
export class Connection {
  constructor() {
    this.send = new Event()
    this.recv = new Event()
    this.close = new Event()
    Object.freeze(this)
  }
}
