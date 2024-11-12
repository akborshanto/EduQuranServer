// Import necessary libraries
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// MongoDB URI (directly defined without .env)
const uri = "mongodb+srv://SchoolMadrasha:JMIILgbEfxYWEXv3@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Set the server port (directly defined)
const PORT = 5001; 

// Set up middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

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
const db = client.db('SchoolManagement'); // Use your database name here
const userCollection = db.collection('usercollection'); // Reference to the 'usercollection' collection

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Hello from Express with MongoDB!');
});


//user nodemailer 
const sendEmail=(emailAddress,emailData)=>{

  const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "akborshanto11111@gmail.com",
      pass: "xlwqyrkxhvhsxgqp",
    },
  });
  


  //veryrify// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
  const mailBody={


    
      from: '"eduquran" <akborshanto11111@gmail.com>', // sender address
      to: emailAddress, // list of receivers
      subject:emailData.suject, // Subject line
      text: "Hello world?", // plain text body
      html: emailData.message, // html body
    
  }

    transporter.sendMail(mailBody,(error,info)=>{

if(error){
  console.log(error)
}else{
  console.log('email send: + ',info.response)
}



   });



}



// Route to create a new user in the 'usercollection' collection
app.post('/api/posts', async (req, res) => {
  // Destructure data from request body
  const { name, email, uploadedImageUrl, password } = req.body;

  // Check if the required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Check if the email already exists in the collection
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      // If email exists, return an error message
      return res.status(400).json({ message: 'Email is already taken.' });
    }

    // Hash the password before saving it
    const saltRounds = 10;  // You can adjust the number of rounds (higher = more secure)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user data into the 'usercollection' collection
    const user = { name, email, uploadedImageUrl, password: hashedPassword };
    const result = await userCollection.insertOne(user);
//send email
sendEmail(email,{

  subject:"Successfully created",
message:"You hav esuccessfulll"
})
    // Return a success response
    res.status(201).json({
      message: 'User created successfully!',
      userId: result.insertedId,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Connect to MongoDB and start the Express server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);
