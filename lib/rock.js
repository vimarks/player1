import { constants } from './constants.js'
import { Moving } from './moving.js'

export class Rock extends Moving {
  constructor(state) {
    let offsetX = Math.random() * 200 - 100 
    let offsetY = Math.random() * 200 - 100 
    let rotation = Math.random() * 2 * Math.PI 

    let velocityX = Math.random() * 200 - 100 
    let velocityY = Math.random() * 200 - 100 

    super(state, 'rock', offsetX, offsetY, rotation, velocityX, velocityY)
  }

  onLeaveLeft() {
    // Wrap the bullet from left to right
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveRight() {
    // Wrap the bullet from right to left
    this.moveTo(-this.offsetX, this.offsetY)
  }

  onLeaveTop() {
    // Wrap the bullet from top to bottom
    this.moveTo(this.offsetX, -this.offsetY)
  }

  onLeaveBottom() {
    // Wrap the bullet from bottom to top
    this.moveTo(this.offsetX, -this.offsetY)
  }
}
