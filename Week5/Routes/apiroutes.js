// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingcontroller');

// API routes for bookings
router.post('/bookings', bookingController.createBooking);
router.get('/api/bookings', bookingController.getBookings);
router.get('/bookings/:name', bookingController.getBookingByName);

module.exports = router;