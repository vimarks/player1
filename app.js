// Create new app
Stage(function(stage) {
  let twoPi = 2 * Math.PI
  let activeKeys = {}
  let KEY_NAMES = {
    37: 'right',
    38: 'up',
    39: 'left',
    40: 'down',
  }

  // Create an image and append it to stage
  let rotation = 0
  let velocityX = 0
  let velocityY = 0
  let offsetX = 0
  let offsetY = 0
  let shuttle = Stage.image('shuttle').appendTo(stage)
  let shuttleWidth = shuttle.pin('width')
  let shuttleHeight = shuttle.pin('height')

  // Set view box
  let width, height
  stage.on('viewport', function(viewport) {
    width = (viewport.width / viewport.height) * 500
    height = 500
    stage.viewbox(width, height, mode = 'in-pad')
  })

  // Align shuttle to center
  shuttle.pin('align', 0.5)

  document.onkeydown = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = true
  }

  document.onkeyup = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = false
  }

  stage.tick(function (dt) {
    if (activeKeys.left && !activeKeys.right) {
      rotation += (1 / dt)
      if (rotation > twoPi) {
        rotation -= twoPi
      }
    } else if (activeKeys.right) {
      rotation -= (1 / dt)
      if (rotation < -twoPi) {
        rotation += twoPi
      }
    }

    if (activeKeys.up) {
      velocityX += Math.sin(rotation) * (1 / dt)
      velocityY -= Math.cos(rotation) * (1 / dt)

      let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY)
      if (velocity >= 6) {
        let adjustment = 6 / velocity
        velocityX *= adjustment
        velocityY *= adjustment
      }
    }

    offsetX += velocityX
    offsetY += velocityY

    let halfWidth = (width + shuttleWidth) / 2
    let halfHeight = (height + shuttleHeight) / 2
    if (offsetX >= halfWidth || offsetX <= -halfWidth) {
      offsetX = -offsetX
    }
    if (offsetY >= halfHeight || offsetY <= -halfHeight) {
      offsetY = -offsetY
    }

    shuttle.pin({
      rotation: rotation,
      offsetX: offsetX,
      offsetY, offsetY,
    })
  })

})

// Adding a texture
Stage({
  image : '/static/shuttle.png',
  textures : {
    shuttle : { x : 0, y : 0, width : 52, height : 52 }
  }
})
