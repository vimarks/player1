import textures from './textures.js'
import { Event } from '../event.js'
import { Game } from './game.js'

// Initialize the application.
textures.forEach(texture => Stage(texture))
Stage(stage => {
  const viewport = new Event()
  const game = new Game()

  // Start the game once viewport is initialized.
  stage.on('viewport', vp => viewport.emit(vp))
  viewport.once(() => game.start(stage))
})
