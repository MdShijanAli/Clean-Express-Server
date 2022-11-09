const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const blogsCollection = client.db("CleanExpressDB").collection("blogs");
        const servicesCollection = client.db("CleanExpressDB").collection("services");
        const reviewsCollection = client.db('CleanExpressDB').collection('reviews')

        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);

        })

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const blog = await blogsCollection.findOne(query);
            res.send(blog);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);

        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review)
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);

        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('trying to delete', id)
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }


}
run().catch(err => console.log(err));






app.get('/', (req, res) => {
    res.send('Slean Service Api Running')
})


app.listen(port, () => {
    console.log(`Server is running on: ${port}`)
})