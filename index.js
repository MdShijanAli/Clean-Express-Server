const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'Unauthorize Access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT, function (err, decoded) {
        if (err) {
            res.status(401).send({ message: 'Unauthorize Access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {

    try {
        const blogsCollection = client.db("CleanExpressDB").collection("blogs");
        const servicesCollection = client.db("CleanExpressDB").collection("services");
        const reviewsCollection = client.db('CleanExpressDB').collection('reviews')


        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRECT, { expiresIn: '1d' })
            res.send({ token })

        })


        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);

        })
        app.get('/home-blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query).limit(3);
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

        app.get('/home-services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);

        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);

        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service)
            const result = await servicesCollection.insertOne(service);
            res.send(result);
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

        app.get('/my-reviews', verifyJWT, async (req, res) => {
            const decoded = req.decoded;
            console.log('inside review api', decoded)
            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'Forbidden Access' })
            }

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

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const review = req.body;
            const option = { upsert: true }
            const updateReview = {
                $set: {
                    comment: review.comment
                }
            }
            const result = await reviewsCollection.updateOne(filter, updateReview, option)
            res.send(result)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('trying to delete', id)
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.findOne(query)
            res.send(result)
        })



    }
    finally {

    }


}
run().catch(err => console.log(err));






app.get('/', (req, res) => {
    res.send('Clean Express Api Running')
})


app.listen(port, () => {
    console.log(`Server is running on: ${port}`)
})