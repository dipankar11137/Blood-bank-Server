const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://blood_bank:ydQqlxj3DGqlPHYk@cluster0.gxqkllr.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log("database connect");
    const userCollection = client.db('blood-bank').collection('user');
    const bloodsCollection = client.db('blood-bank').collection('bloods');
    const buyBloodsCollection = client.db('blood-bank').collection('buyBloods');
    //   // // // // // // // // // // // //

    // create and update User
    //create and update a user
    app.put('/create-user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const filter = { email: email };
      const options = { upsert: true };

      const updatedDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // get user
    app.get('/user', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // // all User filter by email category
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });
    // get blood
    app.get('/bloods', async (req, res) => {
      const query = {};
      const cursor = bloodsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get blood by id
    app.get('/blood/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bloodsCollection.findOne(query);
      res.send(result);
    });
    // restock blood item and update
    app.put('/bloodId/:id', async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await bloodsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    //                     Buy    //
    // post buy
    app.post('/buyBlood', async (req, res) => {
      const postResult = req.body;
      const result = await buyBloodsCollection.insertOne(postResult);
      res.send(result);
    });

    // // Get all Notice
    // app.get('/notices', async (req, res) => {
    //   const query = {};
    //   const cursor = noticeCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    // // Notices Filter by email
    // app.get('/notice/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const cursor = noticeCollection.find(query);
    //   const user = await cursor.toArray();
    //   res.send(user);
    // });
    // // // Delete one Notice
    // app.delete('/notices/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await noticeCollection.deleteOne(query);
    //   res.send(result);
    // });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Blood Bank');
});

app.listen(port, () => {
  console.log('Blood Bank is running ');
});
