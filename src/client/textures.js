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
      star: buildCircle(5),
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
      explosion: buildAnimation(3, 5, 12, 52, 52),
    },
  },
  {
    image: crystalSheet,
    textures: {
      crystal: buildAnimation(36, 5, 180, 50, 90),
    },
  },
  {
    image: powerupSheet,
    textures: {
      powerup: buildAnimation(6, 5, 30, 60, 60),
    },
  },
]

function buildAnimation(rows, cols, frames, width, height) {
  let count = 0
  let texture = []
  for (let y = 0; y < rows * height; y += height) {
    for (let x = 0; x < cols * width; x += width) {
      if (count++ < frames) texture.push({ x, y, width, height })
    }
  }
  return texture
}

function buildCircle(radius, fill = '#fff') {
  const width = radius * 2
  const height = radius * 2
  const ratio = 1

  return Stage.canvas(function (ctx) {
    this.size(width, height, ratio)
    ctx.scale(ratio, ratio)
    ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI)
    ctx.fillStyle = fill
    ctx.fill()
  })
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
