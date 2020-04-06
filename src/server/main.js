import { strict as assert } from 'assert'
import Automerge from 'automerge'
import WebSocket from 'ws'
import constants from '../constants.js'
import { elapsed } from '../time.js'
import { Game } from './game.js'
import { Message } from '../state/protocol.js'

const wss = new WebSocket.Server({
  port: process.env.PORT || 8081,
})

// Mimicks the methods we need on the `stage` object
const stage = {
  first: () => stage,
  width: () => constants.viewbox.width,
  height: () => constants.viewbox.height,
}

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
    newGame.start(stage)
    games.set(gameId, newGame)
  }
  const game = games.get(gameId)

  // Use the websocket to synchronize the state docs
  const sendMsg = merge => ws.send(JSON.stringify(new Message({ merge })))
  const conn = new Automerge.Connection(game.doc.docSet, sendMsg)
  ws.on('close', () => conn.close())
  ws.on('message', data => {
    const msg = Message.fromJSON(data)
    if (msg.merge) {
      conn.receiveMsg(msg.merge)
    }
  })
  conn.open()
})

// Constantly send ping requests to every client
wss.on('listening', () => {
  const interval = setInterval(() => {
    wss.clients.forEach(ws => ws.ping())
  }, 500)
  wss.on('close', () => {
    clearInterval(interval)
  })
})
