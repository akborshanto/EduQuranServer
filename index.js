// Import necessary libraries
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create an Express app
const app = express();

// MongoDB URI (directly defined without .env)
const uri = "mongodb+srv://eduquran:2jaVknZQEuEwKBIw@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Set the server port (directly defined)
const PORT = 5001; 

// Set up middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Create a MongoClient with the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// MongoDB connection function
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Stop the server if connection fails
  }
}

// Get reference to the database and collection
const db = client.db('EduQuran'); // Use your database name here
const postsCollection = db.collection('posts'); // Reference to the 'posts' collection

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Hello from Express with MongoDB!');
});

// Test MongoDB connection with ping
// app.js (Backend)


// Route to create a new post in the 'posts' collection
app.post('/api/posts', async (req, res) => {
  const { title, content, likes } = req.body; // Destructure the post data from request body
  console.log(title, content, likes); // Log to check if you’re getting the right data

  try {
    // Insert the new post into the 'posts' collection
    const result = await postsCollection.insertOne({
      title,
      content,
      likes: likes || 0, // Default to 0 if likes is not provided
    });

    // Send the result back to the client
    res.status(201).json(result);  // Respond with the result of the insert
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Connect to MongoDB and start the Express server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);
