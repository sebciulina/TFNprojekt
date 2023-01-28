const express = require("express");
const app = express();
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;
const uri = process.env.URI_KEY;
let db;

MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  db = client.db("movies");
});

recordRoutes.get("/movies", (req, res) => {
    db.collection("records")
      .find({})
      .toArray((err, result) => {
        if (err) throw err;
        res.json(result);
      });
  });
  
  recordRoutes.get("/movies:id", (req, res) => {
    const id = req.params.id;
    db.collection("records").findOne({ _id: ObjectId(id) }, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  
  recordRoutes.post("/movies", (req, res) => {
    const movie = req.body;
    db.collection("records").insertOne(movie, (err, result) => {
      if (err) throw err;
      res.json({ message: "Movie added successfully" });
    });
  });
  

module.exports = recordRoutes;
