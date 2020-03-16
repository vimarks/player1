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

  // The constant velocity of flying bullets.
  bulletVelocity: 1000,

  // How long a bullet lasts after being fired
  bulletDecay: 1300,

  // Probability that RockMaker creates new rocks.
  newRockChance: 0.4,

  // Maximum velocity of a rock.
  rockMaxVelocity: 95,

  // Determines maximum size of new rocks.
  rockMaxScale: 3,

  // The constant height of the viewbox, scaled to the size of the window.
  viewboxHeight: 1200,

  // Defines the map of bound keyboard actions.
  keyBindings: {
    32 /* space */: 'fire',
    38 /* up    */: 'accelerate',
    37 /* left  */: 'turnLeft',
    40 /* down  */: null,
    39 /* right */: 'turnRight',
    87 /* W     */: 'accelerate',
    65 /* A     */: 'turnLeft',
    83 /* S     */: null,
    68 /* D     */: 'turnRight',
  },

  // Defines the map of bound mouse actions.
  mouseBindings: {
    move: 'focus',
    click: 'accelerate',
    middleClick: null,
    rightClick: 'fire',
  },

  // The minimum time between sending actions.
  actionIntervals: {
    fire: 750,
    focus: 100,
  },
}
