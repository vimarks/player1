import Automerge from 'automerge'
import { Event } from './event.js'
import { Message } from './conn.js'

/**
 * Keeps the shared game state.
 */
export class StateDoc {
  constructor() {
    this.doc = this.initial = Automerge.init()
    this.changed = new Event()
    this.updated = new Event()
  }

  initialize() {
    // Create tables and counters for all synced state
    this.doc = Automerge.change(this.doc, doc => {
      doc.rocks = new Automerge.Table()
    })
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

  /**
   * Remove an id from a table in the shared state, ignoring race errors.
   */
  remove(getTable, id) {
    this.change(doc => {
      try {
        getTable(doc).remove(id)
      } catch (err) {}
    })
  }
}
