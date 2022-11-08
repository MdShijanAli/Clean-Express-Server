const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Slean Service Api Running')
})

// username: cleanDBUser
// pass: xnsP3pTJl3Qjz6lT



const uri = "mongodb+srv://cleanDBUser:xnsP3pTJl3Qjz6lT@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






app.listen(port, () => {
    console.log(`Server is running on: ${port}`)
})