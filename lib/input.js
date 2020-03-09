import { constants } from "./constants.js";

// Arguments to stage.js events need to be objects, so this is just used as a
// marker for simple boolean actions (active vs inactive).
let ACTIVE = [true];

/**
 * Binds input events from the keyboard, mouse, or touch screen to a set of
 * actions.
 *
 * A simple event, e.g. "accelerate", can be checked:
 *
 *   if (actions.accelerate) {
 *     // ...
 *   }
 *
 * It will also publish events:
 *
 *   stage.on('action.accelerate', () => ...)
 *   stage.on('action.accelerate.clear', () => ...)
 *
 * More complex events, e.g. "focus", might store a value:
 *
 *   if (actions.focus) {
 *     let x = actions.focus.x
 *     let y = actions.focus.y
 *     // ...
 *   }
 *
 */
export class Input {
  keyBindings = constants.keyBindings;
  mouseBindings = constants.mouseBindings;

  constructor(actions) {
    this.actions = actions;
    this.mouseClicked = false;
    this.firstTouch = null;
    this.secondTouch = null;
  }

  start(stage) {
    // Any key is pressed
    document.onkeydown = evt => this.onKeyDown(stage, evt);

    // Any key is released
    document.onkeyup = evt => this.onKeyUp(stage, evt);

    // The mouse leaves the screen
    document.onmouseout = evt => this.onMouseOut(stage, evt);

    // A touch- or mouse-based movement event
    stage.on("mousemove", point => this.onMouseMove(stage, point));
    stage.on("touchmove", point => this.onTouchMove(stage, point));

    // A mouse click start event
    stage.on("mousedown", point => this.onMouseStart(stage, point));
    stage.on("touchstart", point => this.onTouchStart(stage, point));

    // A touch or a mouse click end event
    stage.on(["mouseup", "mousecancel"], point =>
      this.onMouseEnd(stage, point)
    );
    stage.on(["touchend", "touchcancel"], point =>
      this.onTouchEnd(stage, point)
    );
  }

  /**
   * Set an action to a new value.
   */
  setAction(stage, action, value = ACTIVE) {
    if (action && this.actions[action] !== value) {
      this.actions[action] = value;
      stage.publish("action." + action, value);
    }
  }

  /**
   * Clear an action by setting its value to `undefined`.
   */
  clearAction(stage, action) {
    if (action && this.actions[action]) {
      this.actions[action] = undefined;
      stage.publish("action." + action + ".clear");
    }
  }

  /**
   * When a bound key is pressed, set its action active.
   */
  onKeyDown(stage, evt) {
    this.setAction(stage, this.keyBindings[evt.keyCode]);
  }

  /**
   * When a bound key is released, clear its action.
   */
  onKeyUp(stage, evt) {
    this.clearAction(stage, this.keyBindings[evt.keyCode]);
  }

  /**
   * When the mouse moves, set its action value to the mouse location.
   */
  onMouseMove(stage, point) {
    let screenWidth = stage.pin("width");
    let screenHeight = stage.pin("height");
    let mouseX = point.x - screenWidth / 2;
    let mouseY = point.y - screenHeight / 2;
    let mousePoint = { x: mouseX, y: mouseY };

    this.setAction(stage, this.mouseBindings.move, mousePoint);
  }

  /**
   * When the mouse leaves the screen, clear the mouse movement action value.
   */
  onMouseOut(stage, evt) {
    this.clearAction(stage, this.mouseBindings.move);
  }

  /**
   * When the mouse clicks down, set its action active.
   */
  onMouseStart(stage, point) {
    let leftButton = point.raw.button === 0;
    if (!this.mouseClicked && leftButton) {
      this.mouseClicked = true;
      this.setAction(stage, this.mouseBindings.click);
    }
  }

  /**
   * When the mouse clicks up, clear its action.
   */
  onMouseEnd(stage, point) {
    let leftButton = point.raw.button === 0;
    if (this.mouseClicked && leftButton) {
      this.mouseClicked = false;
      this.clearAction(stage, this.mouseBindings.click);
    }
  }

  /**
   * When the first touch moves, set its action value to the touch location.
   */
  onTouchMove(stage, point) {
    if (this.isTouchChanged(point, this.firstTouch)) {
      // Only the first touch should simulate mouse movement
      this.onMouseMove(stage, point);
    }
  }

  /**
   * When new touches starts, update the first and second touch pointers and set
   * their action values.
   */
  onTouchStart(stage, point) {
    let changedTouches = point.raw.changedTouches;
    let i = 0;
    if (this.firstTouch === null) {
      // The first touch simulates mouse movement
      this.firstTouch = changedTouches[i++].identifier;
      this.onTouchMove(stage, point);
    }
    if (this.secondTouch === null && changedTouches[i]) {
      // The second touch simulates mouse clicking
      this.secondTouch = changedTouches[i++].identifier;
      this.setAction(stage, this.mouseBindings.click);
    }
  }

  /**
   * When touches end, clear their touch pointers and clear their action values.
   */
  onTouchEnd(stage, point) {
    if (this.isTouchChanged(point, this.firstTouch)) {
      // The first touch simulates mouse movement
      this.firstTouch = null;
      this.clearAction(stage, this.mouseBindings.move);
    }
    if (this.isTouchChanged(point, this.secondTouch)) {
      // The second touch simulates mouse clicking
      this.secondTouch = null;
      this.clearAction(stage, this.mouseBindings.click);
    }
  }

  /**
   * Return true if the given touch identifier is in the set of changed touches.
   */
  isTouchChanged(point, identifier) {
    if (identifier) {
      for (let changedTouch of point.raw.changedTouches) {
        if (changedTouch.identifier === identifier) {
          return true;
        }
      }
    }
    return false;
  }
}
