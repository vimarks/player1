// Create new app
Stage(function(stage) {
  let twoPi = 2 * Math.PI
  let activeKeys = {}
  let KEY_NAMES = {
    32: 'space',
    37: 'right',
    38: 'up',
    39: 'left',
    40: 'down',
  }

  let bullets = []
  let reloading = false
  let RELOAD_TIME = 750

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
      offsetY: offsetY,
    })

    if (activeKeys.space && !reloading) {
      bullets.push(new Bullet(offsetX, offsetY, rotation, velocityX, velocityY))
      reloading = true
      setTimeout(function() { reloading = false }, RELOAD_TIME)
    }

    for (bullet of bullets) {
      bullet.tick(dt)
    }
  })

  function Bullet(x, y, rotation, velocityX, velocityY) {
    let bullet = Stage.image('bullet')
    bullet.appendTo(stage)

    this.img = bullet
    this.x = x
    this.y = y
    this.rotation = rotation
    this.velocityX = velocityX + 25
    this.velocityY = velocityY + 25
    return this
  }

  Bullet.prototype.tick = function(dt) {
    this.x += Math.sin(this.rotation) * (this.velocityX / dt)
    this.y -= Math.cos(this.rotation) * (this.velocityY / dt)

    let halfWidth = width / 2
    let halfHeight = height / 2
    if (this.x >= halfWidth || this.x <= -halfWidth) {
      this.x = -this.x
    }
    if (this.y >= halfHeight || this.y <= -halfHeight) {
      this.y = -this.y
    }
    this.img.pin({
      offsetX: this.x,
      offsetY: this.y,
      align: 0.5,
      rotation: this.rotation
    })
  }

})

// Adding a texture
Stage({
  image : '/static/shuttle.png',
  textures : {
    shuttle : { x : 0, y : 0, width : 52, height : 52 }
  }
})

Stage({
  image: '/static/laser-blue.png',
  textures: {
    bullet: { x: 0, y: 0, width: 15, height: 30 } 
  }
})
