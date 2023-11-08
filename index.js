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
    const bookingRoomCollection = database.collection('bookingRoom');

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
      const query = { _id: new ObjectId(id) };
      const room = await roomsCollection.findOne(query);

      res.send(room);
    })


    app.post('/bookingRoom', async (req, res) => {
      const getRoom = req.body.room;
      const bookedRoom = {
        name: getRoom.name,
        room_image: getRoom.room_image,
        description: getRoom.description,
        price: getRoom.price,
        room_size: getRoom.room_size,
        special_offers: getRoom.special_offers,
        room_rating: getRoom.room_rating,
        email: req.body.userEmail,
        bookingDate: req.body.date
      }

      const addBookedRoom = await bookingRoomCollection.insertOne(bookedRoom);
      const roomId = req.body.roomId;
      const newSeatsValue = req.body.newSeatsValue;

      const query = { _id: new ObjectId(roomId) }
      const options = { upsert: true }
      const updateRoomSeats = {
        $set: {
          name: getRoom.name,
          description: getRoom.description,
          price: getRoom.price,
          room_size: getRoom.room_size,
          availability: getRoom.availability,
          room_image: getRoom.room_image,
          gallery_images: [
            getRoom.gallery_images[0],
            getRoom.gallery_images[1],
            getRoom.gallery_images[2],
            getRoom.gallery_images[3]
          ],
          special_offers: getRoom.special_offers,
          room_rating: getRoom.room_rating,
          seats: newSeatsValue
        }
      }

      const updateRoom = await roomsCollection.updateOne(query, updateRoomSeats, options);

      res.send(updateRoom);
    })


    app.get('/bookingRoom', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const userBooking = await bookingRoomCollection.find(query).toArray();

      res.send(userBooking)
    })

    app.delete('/bookingRoom/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingRoomCollection.deleteOne(query)
      res.send(result);
    })


    app.put('/updateBooking/:id', async (req, res) => {
      const id = req.params.id;
      const date = req.body.date;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBooking = {
        $set: {
          bookingDate: date
        }
      }

      const updateBooking = await bookingRoomCollection.updateOne(query, updatedBooking, options);

      res.send(updateBooking)
    })


    app.post('/addReview/:id', async (req, res) => {
      const id = req.params.id;
      const review = req.body;
      const query = {_id: new ObjectId(id)};
      const room = await roomsCollection.findOne(query);
 
      const result = await roomsCollection.updateOne(
        query,
        
      )

      res.send(result)
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