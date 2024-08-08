const mongoose = require('mongoose');
//Note : I removed my credentials since I didn't use an .env file to store the data.
const mongoURI = 'YOUR_MONGODB_ATLAS_CONNECTION_STRING'; // Replace with your MongoDB connection string

const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    date: Date,
    time: String
});

const Booking = mongoose.model('Booking', bookingSchema);

const runDBConnection = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

module.exports = {
    Booking,
    runDBConnection
};
