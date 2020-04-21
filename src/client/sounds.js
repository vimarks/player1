import { Event } from '../event.js'
import preload from './preload.js'

import crystalCaptureSound from '../static/sounds/crystal-capture.wav'
import powerupCaptureSound from '../static/sounds/powerup-capture.wav'
import crystalSpawnSound from '../static/sounds/crystal-spawn.wav'
import explosionSound from '../static/sounds/explosion.wav'
import bulletSound from '../static/sounds/shoot-bullet.wav'
import laserSound from '../static/sounds/shoot-laser.wav'

export default {
  crystalCapture: bindSoundEffect(crystalCaptureSound),
  powerupCapture: bindSoundEffect(powerupCaptureSound),
  crystalSpawn: bindSoundEffect(crystalSpawnSound),
  explosion: bindSoundEffect(explosionSound),
  shootBullet: bindSoundEffect(bulletSound),
  shootLaser: bindSoundEffect(laserSound),
}

function bindSoundEffect(soundFile) {
  const audio = document.createElement('audio')
  audio.src = preload(soundFile, 'audio')
  return new Event().on(() => audio.play())
}
