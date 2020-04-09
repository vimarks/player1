import { Event } from '../event.js'
import crystalCaptureSound from '../static/sounds/crystal-capture.wav'
import crystalSpawnSound from '../static/sounds/crystal-spawn.wav'
import explosionSound from '../static/sounds/explosion.wav'
import shootSound from '../static/sounds/shoot-laser.wav'

export default {
  crystalCapture: bindSoundEffect(crystalCaptureSound),
  crystalSpawn: bindSoundEffect(crystalSpawnSound),
  explosion: bindSoundEffect(explosionSound),
  shootLaser: bindSoundEffect(shootSound),
}

function bindSoundEffect(soundFile) {
  const audio = document.createElement('audio')
  audio.src = soundFile
  return new Event().on(audio.play.bind(audio))
}
