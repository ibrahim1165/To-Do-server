const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikrvr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const tasksCollection = client.db("myTodo").collection("tasks");
      const completedCollection = client.db("myTodo").collection("completed");
  
      //   posting added tasks in db
      app.post("/tasks", async (req, res) => {
        const tasks = req.body;
        const result = await tasksCollection.insertOne(tasks);
        res.send(result);
      });
      // posting completed task
      app.post("/completed", async (req, res) => {
        const completed = req.body;
        const result = await completedCollection.insertOne(completed);
        res.send(result);
      });
      //   getting data for home page tasks
      app.get("/myTasks", async (req, res) => {
        const email = req.query.email;
  
        const query = { email: email };
        const cursor = tasksCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });
      //having completed tasks collection
      app.get("/completed", async (req, res) => {
        const email = req.query.email;
  
        const query = { email: email };
        const cursor = completedCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });
      // getting single data for editing page
      app.get("/taskediting/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await tasksCollection.findOne(query);
        res.send(result);
      });
      // removing data from task collections
      app.delete("/task/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      });
      // editing a task
      app.put("/editTask/:email", async (req, res) => {
        const email = req.params.email;
        
        const user = req.body;
       
        const query = { email: email };
        const options = { upsert: true };
        const info = {
          $set: {
            email: user.email,
            task: user.task,
            category: user.category,
            time: user.time,
            newDate: user.newDate,
          },
        };
        const result = await tasksCollection.updateOne(query, info, options);
  
        res.send(result);
      });
    } finally {
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })