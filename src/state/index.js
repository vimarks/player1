import Automerge from 'automerge'
import { Rock } from '../rock.js'
import { elapsed } from '../time.js'
import { StateDoc } from './doc.js'
import { Message } from './protocol.js'
import id from './id.js'

/**
 * Manage the game state that is synchronized with the server.
 */
export class State {
  constructor(url) {
    this.url = url
    this.doc = new StateDoc()
    this.rockMap = new Map()
  }

  /**
   * Check for rocks that have not yet been written to the screen.
   */
  updateRocks(stage, when, rocks) {
    rocks.rows.forEach(data => {
      let existing = this.rockMap.get(data.id)
      if (!existing) {
        let rock = new Rock(data)
        let age = when - data.when
        this.rockMap.set(data.id, rock)
        rock.leave
          .on(() => this.rockMap.delete(data.id))
          .on(() => this.doc.remove(doc => doc.rocks, data.id))
        rock.start(stage)
        rock.tick(age, stage)
      }
    })
  }

  start(stage) {
    // Initialize the shared state doc
    this.doc.initialize()

    // Connect to the server to synchronize state
    let ws = new WebSocket(`${this.url}?game=${id}`)
    let sendMsg = merge => ws.send(JSON.stringify(new Message({ merge })))
    let conn = new Automerge.Connection(this.doc.docSet, sendMsg)
    let opened = false
    ws.onmessage = event => {
      const msg = Message.fromJSON(event.data)
      this.doc.updated.during(
        () => conn.receiveMsg(msg.merge),
        doc => this.updateRocks(stage, msg.time, doc.rocks)
      )
      if (!opened) {
        conn.open()
        opened = true
      }
    }
    ws.onclose = () => opened && conn.close()
  }
}
