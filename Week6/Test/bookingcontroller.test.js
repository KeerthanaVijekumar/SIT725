const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Booking, runDBConnection } = require('../Models/bookingmodel');
const bookingController = require('../Controllers/bookingcontroller');
const app = express();

// Middleware
app.use(bodyParser.json());

// Define a test route to test the controller
app.post('/api/bookings', bookingController.createBooking);
app.get('/api/bookings', bookingController.getBookings);
app.get('/api/bookings/:name', bookingController.getBookingByName);

describe('Booking Controller', () => {
    
    before(async function() {
        // Connect to MongoDB before running tests
        await runDBConnection();
    });
    
    beforeEach(async function() {
        // Clear the database before each test
        await mongoose.connection.db.collection('Booking').deleteMany({});
    });
    
    it('should create a new booking and return status 201', async function() {
        const response = await request(app)
            .post('/api/bookings')
            .send({
                name: 'Kay',
                phone: '1234567890',
                date: '2024-09-01',
                time: '10:00'
            })
            .expect(201);

        // Check the Content-Type header
        expect(response.headers['content-type']).to.match(/json/);

        // Check response body with additional fields and normalized date
        const expectedResponse = {
            name: 'Kay',
            phone: '1234567890',
            date: '2024-09-01T00:00:00.000Z', // Match the format returned by MongoDB
            time: '10:00',
            _id: response.body._id, // Include _id since it's generated by MongoDB
            __v: response.body.__v  // Include __v if it's part of the response
        };

        expect(response.body).to.deep.include(expectedResponse);
    });    
});


describe('GET /api/bookings', () => {

    before(async function () {
        this.timeout(10000); // Allow enough time for MongoDB connection
        await runDBConnection(); // Ensure DB connection is ready
    });

    beforeEach(async function () {
        await Booking.deleteMany({});
    });    

    it('should return all bookings and status 200', async () => { 
        const bookings = [
            { name: 'Kay', 
            phone: '1234567890', 
            date: '2024-09-01T00:00:00.000Z',
            time: '10:00'
        }
        ];

        // Insert mock data into the database
        await Booking.insertMany(bookings);

        const response = await request(app)
            .get('/api/bookings')
            .timeout({ deadline: 5000, response: 2000 }) // Set timeout here
            .expect(200);

        // Check the Content-Type header
        expect(response.headers['content-type']).to.match(/json/);

        // Normalize the response data (for date and excluding _id and __v)
        const normalizedResponse = response.body.map(booking => ({
            name: booking.name,
            phone: booking.phone,
            date: booking.date.split('T')[0], // Normalize date
            time: booking.time
        }));

        // Compare the actual response with the expected result
        const expectedResponse = bookings.map(booking => ({
            name: booking.name,
            phone: booking.phone,
            date: booking.date.split('T')[0],
            time: booking.time
        }));

        expect(normalizedResponse).to.deep.equal(expectedResponse);
    });

    it('should handle errors and return status 500', async () => {
        // Stub the Booking.find method to throw an error
        const findStub = sinon.stub(Booking, 'find').rejects(new Error('Failed to fetch bookings'));

        const response = await request(app)
            .get('/api/bookings')
            .timeout({ deadline: 5000, response: 2000 }) // Set timeout here
            .expect(500);

        expect(response.body.error).to.equal('Failed to fetch bookings');
        findStub.restore(); // Restore the stubbed method
    });
});

describe('GET /api/bookings/:name', () => {

    before(async function () {
        this.timeout(10000); // Allow enough time for MongoDB connection
        await runDBConnection(); // Ensure DB connection is ready
    });

    beforeEach(async function () {
        await Booking.deleteMany({});
    });

    it('should return the specific booking by name and status 200', async () => {
        const specificName = 'Kay';
        const booking = {
            name: specificName,
            phone: '1234567890',
            date: '2024-09-01T00:00:00.000Z',
            time: '10:00'
        };
    
        // Insert the booking into the database
        await Booking.insertMany([booking]);
    
        const response = await request(app)
            .get(`/api/bookings/${specificName}`)
            .timeout({ deadline: 10000, response: 2000 }) // Set timeout here
            .expect(200);
    
        // Check the Content-Type header
        expect(response.headers['content-type']).to.match(/json/);
    
        // Extract relevant fields for comparison
        const responseBody = {
            name: response.body.name,
            phone: response.body.phone,
            date: response.body.date,
            time: response.body.time
        };
    
        // Check response body
        expect(responseBody).to.deep.equal(booking);
    });
    

    // Test for GET /api/bookings/:name handling errors
it('should handle errors and return status 500', async function () {
    // Simulate an error by making the database operation fail
    sinon.stub(Booking, 'findOne').throws(new Error('Database failure'));

    const response = await request(app)
        .get('/api/bookings/InvalidName')
        .expect(500);

    expect(response.body.error).to.equal('Failed to fetch specific booking');

    // Restore the stub
    Booking.findOne.restore();
});

    
});