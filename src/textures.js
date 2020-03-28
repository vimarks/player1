import Stage from 'stage-js/platform/web'

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
    textures: {
      text: function(d) {
        d += ''
        return Stage.canvas(function(ctx) {
          var ratio = 2
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

export default textures