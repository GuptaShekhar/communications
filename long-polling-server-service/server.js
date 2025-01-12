const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000
const messages = []
let clients = []

app.use(express.json())
app.use(cors())

app.get('/poll-messages', (req, res)=> {
    console.log('Client connected for long poll')
    let isResponseSent = false
    clients.push(res)
    let timeoutId = setTimeout(()=> {
        if(!isResponseSent) {
            res.status(200).json([])
            isResponseSent = true
        }
        clients = clients.filter(client=> client != res)
    }, 20000)

    req.on('close', ()=> {
        if (!isResponseSent) {
            clearTimeout(timeoutId)
            isResponseSent = true
        }
        clients = clients.filter(client=> client != res)
        console.log('Client disconnected before timeout');
    })
})


app.post('/send-message', (req, res)=> {
    console.log('Client send message for long poll')
    const { message } = req.body
    if (!message) {
        res.status(400).send({ error: 'Message is required params'})
    }
    const newMessage = {
        id: messages.length + 1,
        content: message,
        timestamp: new Date()
    }
    messages.push(newMessage)
    clients.forEach(client=> client.status(200).json([newMessage]))
    clients = []
    res.status(201).send({ success: true, message: 'Message sent successfully.' });
})


app.listen(PORT, ()=> {
    console.log('Long polling service server is live on port:', PORT)
})


