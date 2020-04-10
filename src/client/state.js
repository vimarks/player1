import { elapsed } from '../time.js'
import { StateDoc } from '../doc.js'
import { Connection } from '../conn.js'
import id from './id.js'
import { Rock } from './rock.js'
import { Crystal } from './crystal.js'

/**
 * Manage the game state that is synchronized with the server.
 */
export class State {
  constructor(url) {
    this.url = url
    this.doc = new StateDoc()
    this.rockMap = new Map()
    this.crystalMap = new Map()
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

  /**
   * Check for crystals that have not yet been written to the screen.
   */
  updateCrystals(stage, when, crystals) {
    crystals.rows.forEach(data => {
      let existing = this.crystalMap.get(data.id)
      if (!existing) {
        let crystal = new Crystal(data)
        let age = when - data.when
        this.crystalMap.set(data.id, crystal)
        crystal.leave
          .on(() => this.rockMap.delete(data.id))
          .on(() => this.doc.remove(doc => doc.rocks, data.id))
        crystal.start(stage)
        crystal.tick(age, stage)
      }
    })
  }

  start(stage) {
    // Connect to the server to synchronize state
    let ws = new WebSocket(`${this.url}?game=${id}`)
    let conn = new Connection()
    conn.send.on(data => ws.send(JSON.stringify(data)))
    ws.onmessage = event => conn.recv.emit(JSON.parse(event.data))
    ws.onclose = () => conn.close.emit()
    ws.onopen = () => this.doc.sync(conn)

    // Handle shared state updates
    this.doc.updated.on((when, doc) => this.updateRocks(stage, when, doc.rocks))
    this.doc.updated.on((when, doc) =>
      this.updateCrystals(stage, when, doc.crystals)
    )
  }
}
