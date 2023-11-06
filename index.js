const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors());
app.use(express.json());



const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // collections
    const database = client.db('BookEase')
    const featuredRoomsCollection = database.collection('featuredRooms')
    const specialOffersCollection = database.collection('SpecialOffers')
    const roomsCollection = database.collection('rooms');

    app.get('/featuredRooms', async (req, res) => {
      const cursor = featuredRoomsCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    })

    app.get('/specialOffers', async (req, res) => {
      const cursor = specialOffersCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    })

    app.get('/rooms', async (req, res) => {
      const cursor = roomsCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    })

    app.get('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const room = await roomsCollection.findOne(query);

      res.send(room);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Welcome to the BookEase Server.')
})

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
})