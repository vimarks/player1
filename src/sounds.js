import { Event } from './event.js'

export default {
  crystalCapture: bindSoundEffect('static/sounds/crystal-capture.wav'),
  crystalSpawn: bindSoundEffect('static/sounds/crystal-spawn.wav'),
  explosion: bindSoundEffect('static/sounds/explosion.wav'),
  shootLaser: bindSoundEffect('static/sounds/shoot-laser.wav'),
}

function bindSoundEffect(soundFile) {
  const audio = document.createElement('audio')
  audio.src = soundFile
  return new Event().on(audio.play.bind(audio))
}
