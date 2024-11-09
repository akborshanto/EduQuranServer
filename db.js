// db.js
const { MongoClient } = require("mongodb");

// Replace the following URL with your MongoDB connection string
const uri = "mongodb+srv://eduquran:2jaVknZQEuEwKBIw@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Create a new MongoClient
const client = new MongoClient(uri);

let db;

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB connected!");
    db = client.db("mydatabase"); // Select the database you want to use
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Stop the server if connection fails
  }
};

const getDB = () => db;

module.exports = { connectToMongoDB, getDB };
