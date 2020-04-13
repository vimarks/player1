import { Event } from './event.js'
import { elapsed } from './time.js'
import { randHex } from './rand.js'

// The types that are kept in the shared game state
export const TYPES = ['rocks', 'crystals']

/**
 * Keeps the shared game state.
 */
export class StateDoc {
  constructor() {
    // Add a new property for each type
    for (const type of TYPES) {
      this[type] = new Table(this, type)
    }
  }

  /**
   * Iterate through each (type, table) combo.
   */
  forEach(handler) {
    for (const type of TYPES) {
      handler(type, this[type])
    }
  }

  /**
   * Synchronize the doc over the given connection.
   */
  sync(conn) {
    // Send document changes on the socket until it closes
    this.forEach((type, table) => {
      table.updated.until(conn.close, (op, id, row, when, source) => {
        if (conn !== source) {
          const changes = [{ type, id, row }]
          conn.send.emit({ when, changes })
        }
      })
    })

    // Receive document changes from the socket
    conn.recv.on(msg => {
      const when = msg.when
      if (msg.changes.length > 0) {
        msg.changes.forEach(({ type, id, row }) => {
          this[type].apply(id, row, when, conn)
        })
      }
    })

    // Send all tables as changes
    const changes = []
    this.forEach((type, table) => {
      table.rows.forEach((row, id) => changes.push({ type, id, row }))
    })
    conn.send.emit({ changes })
  }
}

/**
 * Manages a table containing the records for a type.
 */
class Table {
  constructor(doc, type) {
    this.doc = doc
    this.type = type
    this.rows = new Map()
    this.updated = new Event()
  }

  /**
   * Apply a change to a row.
   */
  apply(id, row, when, source) {
    const existing = this.rows.get(id)
    if (row) {
      if (existing) {
        Object.assign(existing, row)
        this.updated.emit('update', id, row, when, source)
      } else {
        this.rows.set(id, row)
        this.updated.emit('add', id, row, when, source)
      }
    } else if (existing) {
      this.rows.delete(id)
      this.updated.emit('remove', id, row, when, source)
    }
  }

  /**
   * Add a row to the table.
   */
  add(row) {
    const id = randHex(16)
    row.mod = elapsed()
    this.rows.set(id, row)
    this.updated.emit('add', id, row)
  }

  /**
   * Update an existing row in the table.
   */
  update(id, handler) {
    const row = this.rows.get(id)
    const saved = handler(row)
    saved.mod = elapsed()
    Object.assign(row, saved)
    this.updated.emit('update', id, saved)
  }

  /**
   * Remove an existing row in the table.
   */
  remove(id) {
    if (this.rows.delete(id)) {
      this.updated.emit('remove', id, null)
    }
  }
}
