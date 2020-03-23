const textures = [
  {
    image: 'static/shuttle.png',
    textures: {
      shuttle: { x: 0, y: 0, width: 52, height: 52 },
    },
  },

  {
    image: 'static/laser-blue.png',
    textures: {
      bullet: { x: 0, y: 0, width: 15, height: 30 },
    },
  },

  {
    image: 'static/asteroid-brown.png',
    textures: {
      rock: { x: 0, y: 0, width: 64, height: 64 },
    },
  },

  {
    image: {
      src: 'static/explosionSpriteSheet.png',
    },
    textures: {
      explosion: [
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 0, y: 0, width: 52, height: 52 },
      ],
    },
  },
]

export default textures
