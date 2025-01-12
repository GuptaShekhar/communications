const  express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000
const messages = []
let messageId = 0

app.use(express.json())
app.use(cors());

app.post('/send-message', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ error: 'Message content is required.' });
    }

    const newMessage = {
        id: ++messageId,
        content: message,
        timestamp: new Date(),
    };

    messages.push(newMessage);
    res.status(201).send({ success: true, message: 'Message added successfully.' });
});

app.get('/poll-messages', (req, res)=> {
    const { lastMessageId } = req.query;

    if (!lastMessageId) {
        res.status(400).send({ error: 'lastMessageId is required params '})
    }

    const newMessage = messages.filter((msg)=> msg.id > lastMessageId)
    res.send(newMessage)
})

app.listen(PORT, ()=> {
    console.log('Short polling server service is live on port:', PORT)
})


setInterval(()=> {
    const newMessage = {
        id: ++messageId,
        data: `Message ${messageId}`,
        timestamp: new Date()
    }
    messages.push(newMessage)
    console.log(`New message added: ${newMessage.data}`);
}, 10000)