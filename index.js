const tracer = require("./tracing")("todo-service");
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());
const port = 3000;

let db;
async function startServer() {
  const client = await MongoClient.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  db = client.db("todo");
  await db.collection("todos").insertMany([
    { id: "1", title: "Buy groceries" },
    { id: "2", title: "Install Aspecto" },
    { id: "3", title: "Buy my own name domain" }
  ]);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();

app.get("/todo", async (req, res) => {
  const todos = await db.collection("todos").find({}).toArray();
  res.json(todos);
});

app.get("/todo/:id", async (req, res) => {
  const todo = await db.collection("todos").findOne({ id: req.params.id });
  res.json(todo);
});
