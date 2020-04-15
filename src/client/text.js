import { Node } from './node.js'

export class Text extends Node {
  constructor({ font = 'sansserif', value, ...pin } = {}) {
    super(Stage.string(font).spacing(1))
    this.value = value
    this.pin = pin
  }

  append(stage) {
    // Position text in the entire window, not just the game box
    stage.append(this.node)
  }

  start(stage) {
    super.start(stage)
    this.node.pin(this.pin)
    delete this.pin
  }

  /**
   * Accessing this.value will return the current text string.
   */
  get value() {
    return this.node.value()
  }

  /**
   * Assigning this.value will update the current text string.
   */
  set value(newValue) {
    this.node.value(newValue)
  }
}
