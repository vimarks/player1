import { constants } from "./constants.js";

// Arguments to stage.js events need to be objects, so this is just used as a
// marker for simple boolean actions (active vs inactive).
let ACTIVE = { active: true };

/**
 * Binds input events from the keyboard, mouse, or touch screen to a set of
 * actions.
 *
 * Action activation, updating, and clearing will publish events:
 *
 *   stage.on('Input.action.accelerate', val => ...)
 *   stage.on('Input.action.accelerate.clear', () => ...)
 *
 * The events published are intended to be consumed by the Actions class.
 */
export class Input {
  constructor(
    keyBindings = constants.keyBindings,
    mouseBindings = constants.mouseBindings,
    source = "Input"
  ) {
    this.keyBindings = keyBindings;
    this.mouseBindings = mouseBindings;
    this.source = source;
    this.valueCache = {};
    this.firstTouchId = null;
    this.secondTouchId = null;
  }

  start(stage) {
    // Any key is pressed
    document.onkeydown = evt => this.onKeyDown(stage, evt);

    // Any key is released
    document.onkeyup = evt => this.onKeyUp(stage, evt);

    // The mouse leaves the screen
    document.onmouseout = evt => this.onMouseOut(stage, evt);

    // Suppress the right-click menu
    document.oncontextmenu = evt => false;

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

  now() {
    return window.performance.now();
  }

  /**
   * Set an action to a new value.
   */
  setAction(stage, action, value = ACTIVE) {
    if (action && this.valueCache[action] !== value) {
      this.valueCache[action] = value;
      stage.publish(`${this.source}.action.${action}`, [this.now(), value]);
    }
  }

  /**
   * Clear an action by setting its value to `undefined`.
   */
  clearAction(stage, action) {
    if (action && this.valueCache[action]) {
      this.valueCache[action] = undefined;
      stage.publish(`${this.source}.action.${action}.clear`, [this.now()]);
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
    let button = point.raw.button;
    if (button === 0 /* left click */) {
      this.setAction(stage, this.mouseBindings.click);
    } else if (button === 1 /* middle click */) {
      this.setAction(stage, this.mouseBindings.middleClick);
    } else if (button === 2 /* right click */) {
      this.setAction(stage, this.mouseBindings.rightClick);
    }
  }

  /**
   * When the mouse clicks up, clear its action.
   */
  onMouseEnd(stage, point) {
    let button = point.raw.button;
    if (button === 0 /* left click */) {
      this.clearAction(stage, this.mouseBindings.click);
    } else if (button === 1 /* middle click */) {
      this.clearAction(stage, this.mouseBindings.middleClick);
    } else if (button === 2 /* right click */) {
      this.clearAction(stage, this.mouseBindings.rightClick);
    }
  }

  /**
   * When the first touch moves, set its action value to the touch location.
   */
  onTouchMove(stage, point) {
    if (this.isTouchChanged(point, this.firstTouchId)) {
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
    if (this.firstTouchId === null) {
      // The first touch simulates mouse movement
      this.firstTouchId = changedTouches[i++].identifier;
      this.onTouchMove(stage, point);
    }
    if (this.secondTouchId === null && changedTouches[i]) {
      // The second touch simulates mouse clicking
      this.secondTouchId = changedTouches[i++].identifier;
      this.setAction(stage, this.mouseBindings.click);
    }
  }

  /**
   * When touches end, clear their touch pointers and clear their action values.
   */
  onTouchEnd(stage, point) {
    if (this.isTouchChanged(point, this.firstTouchId)) {
      // The first touch simulates mouse movement
      this.firstTouchId = null;
      this.clearAction(stage, this.mouseBindings.move);
    }
    if (this.isTouchChanged(point, this.secondTouchId)) {
      // The second touch simulates mouse clicking
      this.secondTouchId = null;
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
