import { Event } from '../event.js'
import { Text } from './text.js'

export class Timer extends Text {
  constructor(timeLimit) {
    super({ alignY: 0.92 })
    this.timeLimit = timeLimit
    this.expire = new Event()
    this.extendTimer = new Event()
    this.showTotalTime = new Event()
  }

  start(stage) {
    super.start(stage)
    this.setCountDownTimer(this.timeLimit * 60)
    this.startCountDownTimer(stage)
    this.extendTimer.on(() => this.addTime())
    let start = performance.now()
    this.showTotalTime.on(() => this.getTotalTime(start))
  }

  getTotalTime(start) {
    let end = performance.now()
    let totalTime = (end - start) / 1000
    let minutes = Math.floor(totalTime / 60)
    let seconds = Math.trunc(totalTime % 60)
    let secondsStr = `${seconds}`.padStart(2, '0')
    this.displayTotalTime(minutes, secondsStr)
  }

  displayTotalTime(minutes, secondsStr) {
    this.value = `round time:  ${minutes}:${secondsStr}`
    clearInterval(this.intervalID)
    this.node.scale(1.5)
    this.node.pin({ alignY: 0.55 })
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
    if (currentTime - 1 == 0) {
      this.expire.emit()
      clearInterval(this.intervalID)
    } else {
      // Subtracts 1 second
      this.setCountDownTimer(currentTime - 1)
    }
  }

  // Gets current time in seconds
  getCurrentTime() {
    let [minutes, seconds] = this.value.split(':')
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
    this.value = `${minutes}:${secondsStr}`
  }

  addTime() {
    let currentTime = this.getCurrentTime()
    this.setCountDownTimer(currentTime + 5)
  }
}
