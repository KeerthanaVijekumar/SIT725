// controllers/bookingController.js
const { Booking } = require('../Models/bookingmodel');

const createBooking = async (req, res) => {
  const { name, phone, date, time } = req.body;

  if (!name || !phone || !date || !time) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const newBooking = new Booking({ name, phone, date, time });

  try {
      await newBooking.save();
      res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error:', error);
      if (error.name === 'ValidationError') {
          return res.status(400).json({ error: 'Validation failed' });
      }
      res.status(500).json({ error: 'Failed to save booking' });
  }
};


const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

const getBookingByName = async (req, res) => {
  const { name } = req.params;

  try {
      const booking = await Booking.findOne({ name });
      if (!booking) {
          return res.status(404).json({ error: 'Failed to fetch specific booking' });
      }
      res.status(200).json(booking);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch specific booking' });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  const { name } = req.params;
  const { phone, date, time } = req.body;

  if (!phone || !date || !time) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      const updatedBooking = await Booking.findOneAndUpdate(
          { name },
          { phone, date, time },
          { new: true, runValidators: true }
      );

      if (!updatedBooking) {
          return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json(updatedBooking);
  } catch (error) {
      if (error.name === 'ValidationError') {
          return res.status(400).json({ error: 'Validation failed' });
      }
      res.status(500).json({ error: 'Failed to update booking' });
  }
};

  
  // Delete a booking
  const deleteBooking = async (req, res) => {
    const { name } = req.params;

    // Example validation for invalid booking names
    const isValidName = /^[a-zA-Z0-9\s]+$/.test(name); // Adjust validation as needed
    if (!isValidName) {
        return res.status(400).json({ error: 'Invalid booking name' });
    }

    try {
        const result = await Booking.findOneAndDelete({ name });

        if (!result) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
};


const getSortedBookings = async (req, res) => {
  const { sort } = req.query;
  
  try {
      let sortBy = {};

      if (sort === 'date') {
          sortBy.date = 1; // Ascending order
      }

      const bookings = await Booking.find().sort(sortBy);
      res.status(200).json(bookings);
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

    
module.exports = {
    createBooking,
    getBookings,
    getBookingByName,
    updateBooking,
    deleteBooking,
    getSortedBookings
};