const WebSocket = require('ws')
const PORT = 4000
const wss = new WebSocket.Server({ port: PORT })

console.log('WebSocket service is running on ws://localhost:4000 ')

const clients = new Set()

wss.on('connection', (ws)=> {
    console.log('New client connected')
    ws.send('Welcome to the WebSocket server!');
    clients.add(ws)
    ws.on('message', (message)=> {
        console.log(`Received: ${message}`)
        clients.forEach(client=> {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
    })

    ws.on('close', ()=> {
        console.log('WebSocket disconnected')
        clients.delete(ws)
    })
    
})

setInterval(()=> {
    const serverMessage = `Server message at ${new Date().toISOString()}`
    console.log('Broadcasting message: ', serverMessage)
    clients.forEach(client=> {
        if (client.readyState === WebSocket.OPEN) {
            client.send(serverMessage)
        }
    })
}, 5000)