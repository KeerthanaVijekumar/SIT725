// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { runDBConnection } = require('./Models/bookingmodel');
const path = require('path');
const bookingController = require('./Controllers/bookingcontroller');
const webRoutes = require('./Routes/webroutes'); // Import static file routes
const apiRoutes = require('./Routes/apiroutes'); // Import API routes

const app = express();
const port = 3040;

// Middleware
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Views')));

// Use the routes
app.use('/', webRoutes); // Serve static file routes
app.use('/', apiRoutes); // Serve API routes


// Connect to MongoDB
const runServer = async () => {
  try {
    await runDBConnection(); // Connect to MongoDB
    console.log('Server is running on port', port);

    // Test MongoDB Connection
    const testConnection = async () => {
      try {
        const result = await mongoose.connection.db.collection('Booking').findOne({});
        console.log('Connection test result:', result);
      } catch (error) {
        console.error('Error during connection test:', error);
      }
    };

    // Ensure the test function is called only after successful connection
    mongoose.connection.once('open', () => {
      console.log('MongoDB connection established');
      testConnection(); // Call the test function
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

runServer();