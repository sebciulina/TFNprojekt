const { MongoClient } = require("mongodb");
require('dotenv').config()
const uri = process.env.URI_KEY;

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        await client.db("movies").command({ ping: 1 });
        console.log("Connected successfully to server");
    } finally {
        await client.close();
    }
}

module.exports = { run }