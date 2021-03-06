import { elapsed } from '../time.js'
import { StateDoc } from '../doc.js'
import { Message, Connection } from '../conn.js'
import id from './id.js'
import { Rock } from './rock.js'
import { Crystal } from './crystal.js'
import { newProjectile } from './cannon.js'
import { Shuttle } from './shuttle.js'
import { Powerup } from './powerup.js'

/**
 * Manage the game state that is synchronized with the server.
 */
export class State {
  constructor(url) {
    this.url = url
    this.doc = new StateDoc()
    this.rockSet = new NodeSet(this.doc.rocks, row => new Rock(row))
    this.crystalSet = new NodeSet(this.doc.crystals, row => new Crystal(row))
    this.shuttleSet = new NodeSet(this.doc.shuttles, row => new Shuttle(row))
    this.powerupSet = new NodeSet(this.doc.powerups, row => new Powerup(row))
    this.projectileSet = new NodeSet(this.doc.projectiles, row =>
      newProjectile(row)
    )
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
    this.shuttleSet.start(stage)
    this.powerupSet.start(stage)
    this.projectileSet.start(stage)
  }
}

/**
 * Manages a set of nodes that are synced with a table on the server.
 */
class NodeSet {
  constructor(table, newNode) {
    this.table = table
    this.newNode = newNode
    this.map = new Map()
  }

  values() {
    return this.map.values()
  }

  /**
   * Add a new row to the node set.
   */
  add(row = {}) {
    const id = this.table.add(row)
    return this.map.get(id)
  }

  start(stage) {
    this.table.added.on((id, row, when) => {
      // Add a new node from the table to the set
      const node = this.startNode(stage, row, when)
      node.remove.on(() => this.table.remove(id))
      node.sync.until(node.remove, (topic, ...args) => {
        const emit = topic ? { topic, args } : undefined
        this.table.update(id, row => node.save(stage, row), emit)
      })
      this.map.set(id, node)
    })

    this.table.updated.on((id, row, when, emit, source) => {
      if (source) {
        // Load updates from the table into the node
        const node = this.map.get(id)
        node.load(stage, row, when)
        if (emit) node.broker.emit(emit.topic, ...emit.args)
      }
    })

    this.table.removed.on((id, row, when, emit, source) => {
      if (source) {
        // Remove the node from the set
        const node = this.map.get(id)
        this.map.delete(id)
        node.remove.emit()
      }
    })
  }

  /**
   * Create and start the node from the row.
   */
  startNode(stage, row, when) {
    const node = this.newNode(row)
    const age = when - row.mod
    node.start(stage)
    node.tick(age, stage)
    return node
  }
}
