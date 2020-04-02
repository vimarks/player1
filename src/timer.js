import Stage from 'stage-js/platform/web'
import { Node } from './node.js'
import { Event } from './event.js'

export class Timer extends Node {
  constructor(timeLimit) {
    super(Stage.string('text'))
    this.timeLimit = timeLimit
    this.expire = new Event()
    this.addTime = new Event()
  }

  append(stage) {
    // Position the timer in the entire window, not just the game box
    stage.append(this.node)
  }

  start(stage) {
    super.start(stage)
    this.node.pin({ alignY: 0.92 })
    this.setCountDownTimer(this.timeLimit * 60)
    this.startCountDownTimer(stage)
    this.addTime.on(() => this.extendTimer())
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
        this.expire.emit()
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
    let secondsStr = `${seconds}`.padStart(2, '0')
    this.node.value(`${minutes}:${secondsStr}`)
  }

  extendTimer() {
    let currentTime = this.getCurrentTime()
    this.setCountDownTimer(currentTime + 5)
  }
}
