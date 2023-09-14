// server/index.js

const { PORT } = require('./config')


const express = require('express')
const expressWs = require('express-ws')

// create a new express application
const app = express()

expressWs(app)

// Contiene las conexiones de los clientes
const connections = new Set()

// Este handle maneja cada conexión web socket
const wsHandler = (ws) => {
    // Agrega la conexión al set
    connections.add(ws)

    // El handler será llamado cada vez que la conexión
    // reciba un nuevo mensaje desde el client
    ws.on('message', (message) => {
        console.log("llegó mensaje: ", message)
        // El mensaje es despachadao a todos los clientes
        connections.forEach((conn) => conn.send(message))
    })

    // Remueve el cliente cuando se cierra
    ws.on('close', () => {
        // The closed connection is removed from the set
        connections.delete(ws)
    })
}

// esta es la ruta de nuestro handler
app.ws('/chat', wsHandler)

console.log("empezando el servidor de web socket en el puerto", PORT)
// start the server
app.listen(PORT)
