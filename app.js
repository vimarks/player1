import { State } from "./lib/state.js";

/**
 * Binds keyboard keys, using the built-in `onkeyup` and `onkeydown`
 * DOM events.
 */
function bindKeys() {
  let activeKeys = {};
  let KEY_NAMES = {
    32: "space",
    37: "right",
    38: "up",
    39: "left",
    40: "down"
  };

  document.onkeydown = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = true;
  };

  document.onkeyup = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = false;
  };

  return activeKeys;
}

/**
 * Initializes the game state and binds the tick function to run
 * every time the screen is rendered.
 */
Stage(function(stage) {
  let state = new State(bindKeys());
  state.start(stage);
});
