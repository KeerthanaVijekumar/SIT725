const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { Booking, mongoURI } = require('../Models/bookingmodel');
const apiRoutes = require('../Routes/apiroutes');
const { expect } = require('chai');
const sinon = require('sinon');

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Your routes would go here
app.use('/api', apiRoutes);

describe('Booking Routes', function () {
  before(async function () {
    await mongoose.connect(mongoURI);
  });

  beforeEach(async function () {
    await Booking.deleteMany({}); // Clear only test-specific data
  });

  after(async function () {
    await mongoose.connection.close();
  });

  // Test for POST /api/bookings
  it('should create a new booking on POST /api/bookings', async function () {
    const newBooking = {
      name: 'Kay',
      phone: '1234567890',
      date: '2024-09-01T00:00:00.000Z',
      time: '10:00',
      test: true
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(newBooking)
      .expect(201);

    expect(response.body.name).to.equal('Kay');
    expect(response.body.phone).to.equal('1234567890');
  });

  // Test for invalid data on POST /api/bookings
it('should return 400 for invalid data on POST /api/bookings', async function () {
    const invalidBooking = {
        name: 'Kay', // Missing other fields
    };

    const response = await request(app)
        .post('/api/bookings')
        .send(invalidBooking)
        .expect(400);

    expect(response.body.error).to.equal('All fields are required'); // Update to match actual message
});


  // Test for GET /api/bookings/:name
  it('should return the specific booking on GET /api/bookings/:name', async function () {
    const booking = new Booking({
      name: 'Jane Doe',
      phone: '0987654321',
      date: '2024-10-01T00:00:00.000Z',
      time: '14:00',
      test: true
    });
    await booking.save();

    const response = await request(app)
      .get(`/api/bookings/${booking.name}`)
      .expect(200);

    expect(response.body.name).to.equal('Jane Doe');
    expect(response.body.phone).to.equal('0987654321');
  });

// Test for GET /api/bookings/:name for non-existing booking
it('should return 404 for non-existing booking on GET /api/bookings/:name', async function () {
    const response = await request(app)
        .get('/api/bookings/NonExistentName')
        .expect(404);

    expect(response.body.error).to.equal('Failed to fetch specific booking');
});


  // Test for GET /api/bookings
  it('should return all bookings on GET /api/bookings', async function () {
    await Booking.insertMany([
      { name: 'Kay', phone: '1234567890', date: '2024-09-01T00:00:00.000Z', time: '10:00', test: true },
      { name: 'Kay', phone: '0987654321', date: '2024-10-01T00:00:00.000Z', time: '14:00', test: true }
    ]);

    const response = await request(app)
      .get('/api/bookings')
      .expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(2);
  });

//Error handling for GET /api/bookings
  it('should handle errors and return status 500 on GET /api/bookings', async function () {
    // Stub the find method to throw an error
    sinon.stub(Booking, 'find').throws(new Error('Database failure'));

    const response = await request(app)
        .get('/api/bookings')
        .expect(500);

    expect(response.body.error).to.equal('Failed to fetch bookings');
});

  // Test for PUT /api/bookings/:name
  it('should update the specific booking on PUT /api/bookings/:name', async function () {
    const booking = new Booking({
      name: 'Kay',
      phone: '1234567890',
      date: '2024-09-01T00:00:00.000Z',
      time: '10:00',
      test: true
    });
    await booking.save();

    const updatedBooking = {
      name: 'Kay',
      phone: '9876543210',
      date: '2024-09-02T00:00:00.000Z',
      time: '11:00'
    };

    const response = await request(app)
      .put(`/api/bookings/${booking.name}`)
      .send(updatedBooking)
      .expect(200);

    expect(response.body.phone).to.equal('9876543210');
  });

  // Error ahndling on update

  it('should return 404 if booking is not found', async function () {
    // Arrange
    const nonExistentBooking = {
        phone: '0000000000',
        date: '2024-09-03T00:00:00.000Z',
        time: '12:00'
    };

    // Act
    const response = await request(app)
        .put('/api/bookings/Nonexistent Name')
        .send(nonExistentBooking)
        .expect(404);

    // Assert
    expect(response.body.error).to.equal('Booking not found');
});

it('should return 400 for missing required fields', async function () {
    // Arrange
    const booking = new Booking({
        name: 'Jane Doe',
        phone: '1234567890',
        date: '2024-09-01T00:00:00.000Z',
        time: '10:00',
        test: true
    });
    await booking.save();

    // Act
    const response = await request(app)
        .put(`/api/bookings/${booking.name}`)
        .send({ phone: '', date: '', time: '' }) // Missing required fields
        .expect(400);

    // Assert
    expect(response.body.error).to.equal('All fields are required');
});


  // Test for DELETE /api/bookings/:name
it('should delete the specific booking on DELETE /api/bookings/:name', async function () {
    const booking = new Booking({
        name: 'Jane Doe',
        phone: '0987654321',
        date: '2024-10-01T00:00:00.000Z',
        time: '14:00',
        test: true
    });
    await booking.save();

    const response = await request(app)
        .delete(`/api/bookings/${booking.name}`)
        .expect(200);

    expect(response.body.message).to.equal('Booking deleted successfully');
});
  
//Error handling for Delete
it('should return 404 if booking is not found', async function () {
    // Act
    const response = await request(app)
        .delete('/api/bookings/NonexistentName')
        .expect(404);

    // Assert
    expect(response.body.error).to.equal('Booking not found');
});

it('should return 400 for invalid booking name', async function () {
    // Act
    const response = await request(app)
        .delete('/api/bookings/invalid_name!@#')
        .expect(400);

    // Assert
    expect(response.body.error).to.equal('Invalid booking name');
});
});