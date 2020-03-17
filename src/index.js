import Stage from 'stage-js/platform/web'
import textures from './textures.js'
import init from './init.js'

// Initialize the application.
textures.forEach(texture => Stage(texture))
Stage(init)
