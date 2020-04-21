import shuttleImage from '../static/shuttle.png'
import bulletImage from '../static/laser-blue.png'
import laserImage from '../static/laser-red.png'
import asteroidImage from '../static/asteroid-brown.png'
import explosionSheet from '../static/explosionSpriteSheet.png'
import crystalSheet from '../static/crystalSpriteSheet.png'
import powerupSheet from '../static/powerupSpriteSheet.png'

export default [
  {
    textures: {
      monospace: buildFont('bold 24px monospace', 24),
      sansserif: buildFont('bold 24px sans-serif', 24),
    },
  },

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
    image: laserImage,
    textures: {
      laser: { x: 0, y: 0, width: 21, height: 32 },
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
    image: powerupSheet,
    textures: {
      powerup: buildTexture(6, 5, 60, 60),
    },
  },
]

function buildTexture(rows, cols, width, height) {
  let texture = []
  for (let y = 0; y < rows * height; y += height) {
    for (let x = 0; x < cols * width; x += width) {
      texture.push({ x, y, width, height })
    }
  }
  return texture
}

function buildFont(font, height, fill = '#ddd') {
  const widths = new Map()
  return function (string) {
    string += ''
    if (!widths.has(string)) {
      widths.set(string, getStringWidth(string, font))
    }
    const width = widths.get(string)
    return Stage.canvas(function (ctx) {
      this.size(width, height)
      ctx.font = font
      ctx.fillStyle = fill
      ctx.textBaseline = 'top'
      ctx.fillText(string, 0, 0)
    })
  }
}

function getStringWidth(string, font) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = font
  return ctx.measureText(string).width
}
