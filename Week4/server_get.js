const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Booking, runDBConnection } = require('./model');
const path = require('path');

const app = express();
const port = 3040;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Example of serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Example of setting views
app.set('views', path.join(__dirname, 'views'));

app.post('/bookings', async (req, res) => {
    const { name, phone, date, time } = req.body;
    const newBooking = new Booking({ name, phone, date, time });

    try {
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save booking' });
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Route to fetch specific booking by name
app.get('/bookings/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const booking = await Booking.findOne({ name: name });
        if (booking) {
            res.json(booking);
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch specific booking' });
    }
});


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
