import textures from './textures.js'
import { Game } from './game.js'

// Initialize the application.
textures.forEach(texture => Stage(texture))
Stage(stage => new Game().start(stage))
