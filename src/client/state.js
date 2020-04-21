import { elapsed } from '../time.js'
import { StateDoc } from '../doc.js'
import { Message, Connection } from '../conn.js'
import id from './id.js'
import { Rock } from './rock.js'
import { Crystal } from './crystal.js'
import { Powerup } from './powerup.js'

/**
 * Manage the game state that is synchronized with the server.
 */
export class State {
  constructor(url) {
    this.url = url
    this.doc = new StateDoc()
    this.rockSet = new NodeSet(this.doc.rocks, Rock)
    this.crystalSet = new NodeSet(this.doc.crystals, Crystal)
    this.powerupSet = new NodeSet(this.doc.powerups, Powerup)
  }

  start(stage) {
    // Connect to the server to synchronize state
    let ws = new WebSocket(`${this.url}?game=${id}`)
    let conn = new Connection()
    conn.send.on(data => ws.send(JSON.stringify(new Message(data))))
    ws.onmessage = event => conn.recv.emit(new Message(JSON.parse(event.data)))
    ws.onclose = () => conn.close.emit()
    ws.onopen = () => this.doc.sync(conn)

    // Handle shared state updates
    this.rockSet.start(stage)
    this.crystalSet.start(stage)
    this.powerupSet.start(stage)
  }
}

/**
 * Manages a set of nodes that are synced with a table on the server.
 */
class NodeSet {
  constructor(table, nodeClass) {
    this.table = table
    this.nodeClass = nodeClass
    this.map = new Map()
  }

  start(stage) {
    this.table.updated.on((op, id, row, when, source) => {
      if (!source) {
        // Ignore local updates
      } else if (op === 'add') {
        // Add a new node from the table to the set
        const newNode = this.nodeClass.add(stage, row, when)
        this.map.set(id, newNode)
        newNode.remove.on(() => this.table.remove(id))
        newNode.sync.on(() => {
          this.table.update(id, row => newNode.save(stage, row))
        })
      } else if (op === 'update') {
        // Load updates from the table into the node
        const node = this.map.get(id)
        node.load(stage, row, when)
      } else if (op === 'remove') {
        // Remove the node from the set
        const node = this.map.get(id)
        node.remove.emit()
        this.map.delete(id)
      }
    })
  }

  values() {
    return this.map.values()
  }
}
