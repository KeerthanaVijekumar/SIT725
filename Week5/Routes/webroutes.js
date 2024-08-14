// routes/webRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();

// Route to serve index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'index.html'));
});

// Route to serve about.html
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'about.html'));
});

// Route to serve booking.html
router.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'bookings.html'));
});

// Route to serve gallery.html
router.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'gallery.html'));
});

// Route to serve services.html
router.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'services.html'));
});

module.exports = router;
