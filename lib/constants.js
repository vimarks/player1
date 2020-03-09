export let constants = {
  // All motion that is relative to framerate should multiply the `dt` value
  // by this coefficient. Changing this value can slow down or speed up the
  // entire game.
  dtCoefficient: 1 / 1000,

  // How quickly the shuttle rotates left or right.
  shuttleRotation: 4,

  // How quickly the shuttle accelerates.
  shuttleAcceleration: 400,

  // The maximum velocity limit for the shuttle.
  shuttleMaxVelocity: 600,

  // The milliseconds between bullets firing from the shuttle.
  reloadTime: 750,

  // The constant velocity of flying bullets.
  bulletVelocity: 200,

  // How long a bullet lasts after being fired
  bulletDecay: 2000,

  // The constant height of the viewbox, scaled to the size of the window.
  viewboxHeight: 1200,

  // Defines the map of bound keyboard actions.
  keyBindings: {
    32 /* space */: "fire",
    37 /* right */: "turnRight",
    38 /* up    */: "accelerate",
    39 /* left  */: "turnLeft"
  },

  // Defines the map of bound mouse actions.
  mouseBindings: {
    move: "focus",
    click: "accelerate"
  }
};
