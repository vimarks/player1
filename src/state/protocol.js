import Automerge from 'automerge'
import { elapsed } from '../time.js'

/**
 * A single message sent from client to server or server to client.
 */
export class Message {
  constructor({ time = elapsed(), merge }) {
    this.time = time
    this.merge = merge
  }

  static fromJSON(str) {
    return new Message(JSON.parse(str))
  }

  send(ws) {
    ws.send(JSON.stringify(this))
  }
}
