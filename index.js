const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://simplebdUser:el6VSlkkhAwaMK9a@cluster0.zoir4cf.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("simplecrud");
    const usersCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      console.log("data in the server", req.body);
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
     console.log(req.params);
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Simple CRUD Server running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
