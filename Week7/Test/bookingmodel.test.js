// test/bookingmodel.test.js
const mongoose = require('mongoose');
const { expect } = require('chai');
const {Booking ,mongoURI, runDBConnection} = require('../Models/bookingmodel'); // Adjust this if your model is in a different location

describe('Booking Model', () => {

    beforeEach(async () => {
        await Booking.deleteMany({});
    });

    after(async () => {
        await mongoose.disconnect();
    });

    it('should create a new booking', async () => {
        const bookingData = {
            name: 'Jane Doe',
            phone: '0987654321',
            date: '2024-09-01T00:00:00.000Z',
            time: '11:00'
        };

        const booking = new Booking(bookingData);
        const savedBooking = await booking.save();

        expect(savedBooking).to.have.property('_id');
        expect(savedBooking.name).to.equal(bookingData.name);
        expect(savedBooking.phone).to.equal(bookingData.phone);
    });

    it('should find a booking by name', async () => {
        const bookingData = {
            name: 'Kay',
            phone: '1234567890',
            date: '2024-09-01T00:00:00.000Z',
            time: '10:00'
        };

        const booking = new Booking(bookingData);
        await booking.save();

        const foundBooking = await Booking.findOne({ name: 'Kay' });

        expect(foundBooking).to.not.be.null;
        expect(foundBooking.name).to.equal('Kay');
    });
});

describe('MongoDB Connection', () => {
    before(async function() {
        this.timeout(5000); // Increase timeout for connection tests if needed
        try {
            await runDBConnection();
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error; // Fail the test if connection fails
        }
    });

    it('should successfully connect to MongoDB and perform a simple query', async function() {
        try {
            // Perform a query to ensure MongoDB is operational
            const result = await mongoose.connection.db.collection('Booking').findOne({});
            if (result) {
                console.log('MongoDB is operational.');
                // Optionally, you can check if the result matches expected data
            } else {
                console.log('No data found in the Booking collection.');
                // You can handle this case as needed
            }
        } catch (error) {
            console.error('Error during MongoDB query:', error);
            throw error; // Fail the test if query fails
        }
    });

    after(async function() {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
            throw error; // Fail the test if disconnection fails
        }
    });
});