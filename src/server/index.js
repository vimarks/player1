import { strict as assert } from 'assert'
import WebSocket from 'ws'
import { Game } from './game.js'
import { Message, Connection } from '../conn.js'

const port = process.env.PORT || 8081
const wss = new WebSocket.Server({ port })

// A map of game ID -> Game, so clients can join existing games
const games = new Map()

// Get the `game` parameter from the connection query string
function getGameId(req) {
  const url = new URL(req.url, `http://server`)
  const gameId = url.searchParams.get('game')
  assert(gameId, 'expected ?game= parameter')
  return gameId
}

// Handle new client connections
wss.on('connection', (ws, req) => {
  const gameId = getGameId(req)
  if (!games.has(gameId)) {
    // New game ID, start a new game
    const newGame = new Game()
    games.set(gameId, newGame)
    newGame.start()
    console.log('starting game', gameId)
  }
  const game = games.get(gameId)

  // Use the websocket to synchronize the state docs
  const conn = new Connection()
  conn.send.on(data => ws.send(JSON.stringify(new Message(data))))
  ws.on('message', data => conn.recv.emit(new Message(JSON.parse(data))))
  ws.on('close', () => conn.close.emit())
  game.join.emit(conn)
  conn.close.trigger(game.leave, conn)

  // Remove the game on end
  game.end.on(() => {
    console.log('ending game', gameId)
    games.delete(gameId)
  })
})

// Constantly send ping requests to every client
wss.on('listening', () => {
  console.log('listening on', port)
  const interval = setInterval(() => {
    wss.clients.forEach(ws => ws.ping())
  }, 500)
  wss.on('close', () => {
    clearInterval(interval)
  })
})
