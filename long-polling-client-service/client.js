const express = require('express')
const path = require('path')
const app = express()

const PORT = 3000

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, ()=> {
    console.log('Long polling client service is live at port:', PORT)
})