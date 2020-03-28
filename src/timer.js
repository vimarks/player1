import Stage from 'stage-js/platform/web'
import { Node } from './node.js'

export class Timer extends Node {
  constructor(timeLimit, offsetX, offsetY, shuttle) {
    let node = Stage.string('text')
    super(node, offsetX, offsetY)
    this.timeLimit = timeLimit
    this.shuttle = shuttle
  }

  start(stage) {
    super.start(stage)
    this.node.value(`${this.timeLimit}:00`)
    this.startCountDownTimer(stage)
  }

  // Starts & updates timer every second
  startCountDownTimer(stage) {
    this.intervalID = setInterval(
      (function (self) {
        return function () {
          self.updateCountDownTimer(stage)
        }
      })(this),
      1000
    )
  }
  // Check if time will be up
  updateCountDownTimer(stage) {
    let currentTime = this.getCurrentTime()
    if (currentTime > 0) {
      if (currentTime - 1 == 0) {
        this.shuttle.explode(stage)
        clearInterval(this.intervalID)
      }
      // Subtracts 1 second
      this.setCountDownTimer(currentTime - 1)
    }
  }
  // Gets current time in seconds
  getCurrentTime() {
    let [minutes, seconds] = this.node.value().split(':')
    minutes = parseInt(minutes)
    seconds = parseInt(seconds)
    seconds = seconds + minutes * 60
    return seconds
  }
  // Converts seconds to minutes:seconds & updates display
  setCountDownTimer(timeLeft) {
    let minutes = Math.floor(timeLeft / 60)
    let seconds = timeLeft % 60
    this.node.value(`${minutes}:${seconds}`)
  }
}
