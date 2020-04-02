import Automerge from 'automerge'
import { Event } from '../event.js'

/**
 * Keeps the shared game state.
 */
export class StateDoc {
  constructor() {
    this.docSet = new Automerge.DocSet()
    this.updated = new Event([null])
  }

  /**
   * Initialize the doc on client or game launch.
   */
  initialize() {
    // When the state doc is updated, emit an `updated` event with the doc
    this.docSet.registerHandler((docId, doc) => {
      if (docId === 'game') {
        this.updated.emit(doc)
      }
    })

    // Initialize the doc with shared tables
    this.docSet.setDoc(
      'game',
      Automerge.change(Automerge.init(), doc => {
        doc.rocks = new Automerge.Table()
      })
    )
  }

  /**
   * Change the shared state.
   */
  change(handler) {
    const oldDoc = this.docSet.getDoc('game')
    const newDoc = Automerge.change(oldDoc, handler)
    this.docSet.setDoc('game', newDoc)
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
