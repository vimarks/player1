import { State } from './lib/state.js'

function bindKeys() {
  let activeKeys = {}
  let KEY_NAMES = {
    32: 'space',
    37: 'right',
    38: 'up',
    39: 'left',
    40: 'down',
  }

  document.onkeydown = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = true
  }

  document.onkeyup = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = false
  }

  return activeKeys
}

Stage(function(stage) {
  let state = new State(bindKeys())
  state.start(stage)
  stage.tick(dt => state.tick(dt, stage))
})
