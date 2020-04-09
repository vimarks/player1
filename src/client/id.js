import { randHex } from '../rand.js'

const urlParams = new URLSearchParams(window.location.search)
const gameId = urlParams.get('game')

if (!gameId) {
  // Add a game ID to the query string.
  urlParams.append('game', randHex(5))
  window.location.search = urlParams.toString()
}

export default gameId
