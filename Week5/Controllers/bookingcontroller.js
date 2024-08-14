// controllers/bookingController.js
const { Booking } = require('../Models/bookingmodel');

const createBooking = async (req, res) => {
    const { name, phone, date, time } = req.body;
    const newBooking = new Booking({ name, phone, date, time });

    try {
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save booking' });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

const getBookingByName = async (req, res) => {
    const { name } = req.params;
    try {
        const booking = await Booking.findOne({ name });
        if (booking) {
            res.json(booking);
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch specific booking' });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBookingByName,
};