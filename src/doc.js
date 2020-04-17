import { Event } from './event.js'
import { elapsed } from './time.js'
import { randHex } from './rand.js'

// The types that are kept in the shared game state
export const TYPES = ['rocks', 'crystals', 'bullets', 'shuttles']

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
      table.sync.until(conn.close, (id, row, when, emit, source) => {
        if (conn !== source) {
          const changes = [{ type, id, row, emit }]
          conn.send.emit({ when, changes })
        }
      })
    })

    // Receive document changes from the socket
    conn.recv.on(msg => {
      const when = msg.when
      if (msg.changes.length > 0) {
        msg.changes.forEach(({ type, id, row, emit }) => {
          this[type].apply(id, row, when, emit, conn)
        })
      }
    })

    // Remove all rows associated with a closed connection
    conn.close.on(() => {
      this.forEach((type, table) => {
        table.removeOwned(conn)
      })
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
    this.owned = new WeakMap()
    this.rows = new Map()
    this.sync = new Event()
    this.added = new Event().trigger(this.sync)
    this.updated = new Event().trigger(this.sync)
    this.removed = new Event().trigger(this.sync)
  }

  /**
   * Set ownership of the given row ID.
   */
  setOwned(source, id) {
    if (!this.owned.has(source)) {
      this.owned.set(source, new Set())
    }
    const owned = this.owned.get(source)
    owned.add(id)
  }

  /**
   * Remove rows owned by the source.
   */
  removeOwned(source) {
    const owned = this.owned.get(source)
    if (owned) owned.forEach(id => this.remove(id))
  }

  /**
   * Apply a change to a row.
   */
  apply(id, row, when, emit, source) {
    const existing = this.rows.get(id)
    if (row) {
      if (existing) {
        Object.assign(existing, row)
        this.updated.emit(id, existing, when, emit, source)
      } else {
        this.rows.set(id, row)
        this.setOwned(source, id)
        this.added.emit(id, row, when, emit, source)
      }
    } else if (existing) {
      this.rows.delete(id)
      this.removed.emit(id, row, when, emit, source)
    }
  }

  /**
   * Add a row to the table.
   */
  add(row) {
    const id = randHex(16)
    const when = elapsed()
    row.mod = when
    this.rows.set(id, row)
    this.added.emit(id, row, when)
    return id
  }

  /**
   * Update an existing row in the table.
   */
  update(id, handler, emit) {
    const row = this.rows.get(id)
    const diff = {}
    const when = elapsed()
    diff.mod = when
    handler(diffProxy(row, diff))
    this.updated.emit(id, diff, when, emit)
  }

  /**
   * Remove an existing row in the table.
   */
  remove(id) {
    if (this.rows.delete(id)) {
      this.removed.emit(id, null, elapsed())
    }
  }
}

/**
 * Return a proxy object for a row, where all changes are written to the diff
 * object as well. The purpose is to avoid redundant properties sent over the
 * network for row updates.
 */
function diffProxy(row, diff) {
  return new Proxy(row, {
    set: (obj, prop, value) => {
      // Write assignments to the target object and the diff
      diff[prop] = obj[prop] = value
      return true
    },
  })
}
