// app.js
const express = require("express");
const { connectToMongoDB } = require("./db");

const app = express();
const PORT = 5001;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectToMongoDB();

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Express with MongoDB!");
});


  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
