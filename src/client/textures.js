import shuttleImage from '../static/shuttle.png'
import bulletImage from '../static/laser-blue.png'
import asteroidImage from '../static/asteroid-brown.png'
import explosionSheet from '../static/explosionSpriteSheet.png'
import crystalSheet from '../static/crystalSpriteSheet.png'

export default [
  {
    image: shuttleImage,
    textures: {
      shuttle: { x: 0, y: 0, width: 52, height: 52 },
    },
  },

  {
    image: bulletImage,
    textures: {
      bullet: { x: 0, y: 0, width: 15, height: 30 },
    },
  },

  {
    image: asteroidImage,
    textures: {
      rock: { x: 0, y: 0, width: 64, height: 64 },
    },
  },

  {
    image: explosionSheet,
    textures: {
      explosion: [
        { x: 0, y: 0, width: 52, height: 52 },
        { x: 52, y: 0, width: 52, height: 52 },
        { x: 104, y: 0, width: 52, height: 52 },
        { x: 156, y: 0, width: 52, height: 52 },
        { x: 208, y: 0, width: 52, height: 52 },
        { x: 0, y: 52, width: 52, height: 52 },
        { x: 52, y: 52, width: 52, height: 52 },
        { x: 104, y: 52, width: 52, height: 52 },
        { x: 156, y: 52, width: 52, height: 52 },
        { x: 208, y: 52, width: 52, height: 52 },
        { x: 0, y: 104, width: 52, height: 52 },
        { x: 52, y: 104, width: 52, height: 52 },
      ],
    },
  },
  {
    image: crystalSheet,
    textures: {
      crystal: buildTexture(36, 5, 50, 90),
    },
  },

  {
    textures: {
      text: function (d) {
        d += ''
        return Stage.canvas(function (ctx) {
          let ratio = 2
          this.size(16, 24, ratio)
          ctx.scale(ratio, ratio)
          ctx.font = 'bold 24px monospace'
          ctx.fillStyle = '#ddd'
          ctx.textBaseline = 'top'
          ctx.fillText(d, 0, 1)
        })
      },
    },
  },
]

function buildTexture(rows, cols, w, h) {
  let texture = []
  let x = 0
  let y = 0
  for (let i = 0; i < rows; i++) {
    if (y != 0) {
      texture.push({ x, y, width: w, height: h })
    }
    x = 0
    for (let i = 0; i < cols - 1; i++) {
      texture.push({ x, y, width: w, height: h })
      x += w
    }
    y += h
  }
  return texture
}
