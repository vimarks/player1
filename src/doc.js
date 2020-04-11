import Automerge from 'automerge'
import { Event } from './event.js'
import { Message } from './conn.js'
import { elapsed } from './time.js'

/**
 * Keeps the shared game state.
 */
export class StateDoc {
  constructor() {
    this.doc = this.initial = Automerge.init()
    this.changed = new Event()
    this.updated = new Event()
    this.rocks = new Table(this, doc => doc.rocks)
    this.crystals = new Table(this, doc => doc.crystals)
  }

  initialize() {
    // Create tables and counters for all synced state
    this.doc = Automerge.change(this.doc, doc => {
      doc.rocks = new Automerge.Table()
      doc.crystals = new Automerge.Table()
    })
  }

  start(stage) {
    this.rocks.start(stage)
    this.crystals.start(stage)
  }

  /**
   * Synchronize the doc over the given connection.
   */
  sync(conn) {
    let connDoc = this.initial

    // Send document changes on the socket until it closes
    this.changed.until(conn.close, () => {
      const changes = Automerge.getChanges(connDoc, this.doc)
      connDoc = this.doc
      if (changes.length > 0) conn.send.emit(new Message({ changes }))
    })

    // Receive document changes from the socket
    conn.recv.on(msg => {
      if (msg.changes) {
        const newDoc = Automerge.applyChanges(this.doc, msg.changes)
        this.doc = newDoc
        this.updated.emit(msg.when, newDoc)
      }
    })

    // Send all changes since doc creation
    this.changed.emit()
  }

  /**
   * Change the shared state.
   */
  change(handler) {
    const oldDoc = this.doc
    const newDoc = Automerge.change(oldDoc, handler)
    this.doc = newDoc
    this.changed.emit()
  }
}

/**
 * Manages operations against a specific table.
 */
class Table {
  constructor(doc, getTable) {
    this.doc = doc
    this.getTable = getTable
    this.updated = new Event()
    this.cache = new Map()
  }

  start(stage) {
    const cache = this.cache
    const updated = this.updated

    this.doc.updated.on((when, doc) => {
      const table = this.getTable(doc)
      const unseen = new Set(cache.keys())

      // Iterate through the table to check for updates
      table.rows.forEach(row => {
        const id = Automerge.getObjectId(row)
        const seq = row.seq.value

        if (!unseen.delete(id)) {
          // Row did not exist in cache, it is newly added
          updated.emit('add', id, row, when)
        } else if (seq !== cache.get(id)) {
          // Row modification sequence is different from cache, it is updated
          updated.emit('update', id, row, when)
        }

        // Update the cache
        cache.set(id, seq)
      })

      // All unseen cache rows after a pass through the table were removed
      unseen.forEach(id => {
        updated.emit('remove', id, null, when)
        cache.delete(id)
      })
    })
  }

  /**
   * Add an object to a table.
   */
  add(data) {
    this.doc.change(doc => {
      const table = this.getTable(doc)
      const id = table.add({
        seq: new Automerge.Counter(),
        mod: elapsed(),
        ...data,
      })
      this.cache.set(id, 0)
    })
  }

  /**
   * Update an object in a table.
   */
  update(id, handler) {
    this.doc.change(doc => {
      const table = this.getTable(doc)
      const row = table.byId(id)
      const seq = row.seq.increment()
      row.mod = elapsed()
      handler(row)
      this.cache.set(id, seq)
    })
  }

  /**
   * Remove an id from a table in the shared state, ignoring race errors.
   */
  remove(id) {
    this.doc.change(doc => {
      const table = this.getTable(doc)
      this.cache.delete(id)
      try {
        table.remove(id)
      } catch (err) {}
    })
  }
}
