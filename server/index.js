const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

const server = new WebSocket.Server({ port: 8080 })

server.broadcast = function broadcast (data) {
  server.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

const NEW_CLIENT_EVENT = 'NEW_CLIENT_EVENT'
const CLOSE_CLIENT_SESSION = 'CLOSE_CLIENT_SESSION'
const TOTAL_CLIENTS_CONNECTED = 'TOTAL_CLIENTS_CONNECTED'
const MESSAGE = 'MESSAGE'

const clientsConnected = {}

const broadcastMessage = function (type, payload) {
  server.clients.forEach (function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: type,
          payload: payload
        })
      )
    }
  })
}

const handleMessage = function (message) {
  const msg = JSON.parse(message)

  switch(msg.type) {
    case CLOSE_CLIENT_SESSION:
      delete clientsConnected[msg.payload]

      console.log(`${msg.payload} disconnected. ${Object.keys(clientsConnected).length} clients now connected.`)

      broadcastMessage(TOTAL_CLIENTS_CONNECTED, Object.keys(clientsConnected).length)
      break
    case MESSAGE:
      broadcastMessage(MESSAGE, msg.payload)
      break
  }
}

const handleConnection = function connection (ws, req) {
  // Create a new user UUID
  const newClientUuid = uuidv4()
  clientsConnected[newClientUuid] = newClientUuid

  console.log(`${newClientUuid} connected from ${req.connection.remoteAddress}. ${Object.keys(clientsConnected).length} clients now connected.`)

  // Send the event back to the client
  ws.send(
    JSON.stringify({
      type: NEW_CLIENT_EVENT,
      payload: newClientUuid
    })
  )

  broadcastMessage(TOTAL_CLIENTS_CONNECTED, Object.keys(clientsConnected).length)

  ws.on('message', handleMessage)
}

server.on('connection', handleConnection)