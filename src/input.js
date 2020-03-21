import { constants } from './constants.js'

// Get the current time in milliseconds.
function now() {
  return performance.now()
}

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
    source = 'Input'
  ) {
    this.keyBindings = keyBindings
    this.mouseBindings = mouseBindings
    this.source = source
    this.valueCache = {}
    this.timeouts = {}
    this.firstTouchId = null
    this.secondTouchId = null
  }

  start(stage) {
    // Any key is pressed
    document.onkeydown = evt => this.onKeyDown(stage, evt)

    // Any key is released
    document.onkeyup = evt => this.onKeyUp(stage, evt)

    // The mouse leaves the screen
    document.onmouseout = evt => this.onMouseOut(stage, evt)

    // Suppress the right-click menu
    document.oncontextmenu = evt => false

    // A touch- or mouse-based movement event
    stage.on('mousemove', point => this.onMouseMove(stage, point))
    stage.on('touchmove', point => this.onTouchMove(stage, point))

    // A mouse click start event
    stage.on('mousedown', point => this.onMouseStart(stage, point))
    stage.on('touchstart', point => this.onTouchStart(stage, point))

    // A touch or a mouse click end event
    stage.on(['mouseup', 'mousecancel'], point => this.onMouseEnd(stage, point))
    stage.on(['touchend', 'touchcancel'], point =>
      this.onTouchEnd(stage, point)
    )
  }

  /**
   * Set an action to a new value.
   */
  setAction(stage, action, value, when = now) {
    if (action && !value.equals(this.valueCache[action])) {
      this.valueCache[action] = value

      let interval = constants.actionIntervals[action]
      if (interval) {
        // Action is rate limited and must be published on an interval
        this.startInterval(stage, action, interval, when, value)
      } else {
        // Action is not rate limited, publish right away
        stage.publish(`${this.source}.action.${action}`, [when(), value])
      }
    }
  }

  /**
   * Start a new interval for publishing a rate limited action. This publishes
   * the action and then sets a timer for the next publish.
   */
  startInterval(stage, action, interval, when, value) {
    if (!this.timeouts[action]) {
      stage.publish(`${this.source}.action.${action}`, [when(), value])
      this.delayNextPublish(stage, action, interval, when, value)
    }
  }

  /**
   * Wakes up after an action rate limit timeout to see if the action should be
   * published again.
   */
  delayNextPublish(stage, action, interval, when, prev) {
    this.timeouts[action] = setTimeout(() => {
      this.timeouts[action] = undefined
      let curr = this.valueCache[action]
      if (curr && !curr.equals(prev)) {
        this.startInterval(stage, action, interval, when, curr)
      }
    }, interval)
  }

  /**
   * Clear an action by setting its value to `undefined`.
   */
  clearAction(stage, action, when = now) {
    if (action && this.valueCache[action]) {
      this.valueCache[action] = undefined
      stage.publish(`${this.source}.action.${action}.clear`, [when()])
    }
  }

  /**
   * When a bound key is pressed, set its action active.
   */
  onKeyDown(stage, evt) {
    this.setAction(stage, this.keyBindings[evt.keyCode], new Active())
  }

  /**
   * When a bound key is released, clear its action.
   */
  onKeyUp(stage, evt) {
    this.clearAction(stage, this.keyBindings[evt.keyCode])
  }

  /**
   * When the mouse moves, set its action value to the mouse location.
   */
  onMouseMove(stage, point) {
    let mouseX = point.x - stage.width() / 2
    let mouseY = point.y - stage.height() / 2
    let mousePoint = new MousePoint(mouseX, mouseY)

    this.setAction(stage, this.mouseBindings.move, mousePoint)
  }

  /**
   * When the mouse leaves the screen, clear the mouse movement action value.
   */
  onMouseOut(stage, evt) {
    this.mouseMovePoint = null
    this.clearAction(stage, this.mouseBindings.move)
  }

  /**
   * When the mouse clicks down, set its action active.
   */
  onMouseStart(stage, point) {
    let button = point.raw.button
    if (button === 0 /* left click */) {
      this.setAction(stage, this.mouseBindings.click, new Active())
    } else if (button === 1 /* middle click */) {
      this.setAction(stage, this.mouseBindings.middleClick, new Active())
    } else if (button === 2 /* right click */) {
      this.setAction(stage, this.mouseBindings.rightClick, new Active())
    }
  }

  /**
   * When the mouse clicks up, clear its action.
   */
  onMouseEnd(stage, point) {
    let button = point.raw.button
    if (button === 0 /* left click */) {
      this.clearAction(stage, this.mouseBindings.click)
    } else if (button === 1 /* middle click */) {
      this.clearAction(stage, this.mouseBindings.middleClick)
    } else if (button === 2 /* right click */) {
      this.clearAction(stage, this.mouseBindings.rightClick)
    }
  }

  /**
   * When the first touch moves, set its action value to the touch location.
   */
  onTouchMove(stage, point) {
    if (this.isTouchChanged(point, this.firstTouchId)) {
      // Only the first touch should simulate mouse movement
      this.onMouseMove(stage, point)
    }
  }

  /**
   * When new touches starts, update the first and second touch pointers and set
   * their action values.
   */
  onTouchStart(stage, point) {
    let changedTouches = point.raw.changedTouches
    let i = 0
    if (this.firstTouchId === null) {
      // The first touch simulates mouse movement
      this.firstTouchId = changedTouches[i++].identifier
      this.onTouchMove(stage, point)
    }
    if (this.secondTouchId === null && changedTouches[i]) {
      // The second touch simulates mouse clicking
      this.secondTouchId = changedTouches[i++].identifier
      this.setAction(stage, this.mouseBindings.click, new Active())
    }
  }

  /**
   * When touches end, clear their touch pointers and clear their action values.
   */
  onTouchEnd(stage, point) {
    if (this.isTouchChanged(point, this.firstTouchId)) {
      // The first touch simulates mouse movement
      this.firstTouchId = null
      this.clearAction(stage, this.mouseBindings.move)
    }
    if (this.isTouchChanged(point, this.secondTouchId)) {
      // The second touch simulates mouse clicking
      this.secondTouchId = null
      this.clearAction(stage, this.mouseBindings.click)
    }
  }

  /**
   * Return true if the given touch identifier is in the set of changed touches.
   */
  isTouchChanged(point, identifier) {
    if (identifier) {
      for (let changedTouch of point.raw.changedTouches) {
        if (changedTouch.identifier === identifier) {
          return true
        }
      }
    }
    return false
  }
}

// Action value indicating the action is active.
class Active {
  constructor() {
    this.active = true
  }

  equals(prev) {
    return prev instanceof Active
  }
}

// Action value containing the current mouse cursor point.
class MousePoint {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  equals(prev) {
    return prev && this.x === prev.x && this.y === prev.y
  }
}
