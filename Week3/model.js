// const mongoose = require('mongoose');
// const { MongoClient, ServerApiVersion, Timestamp } = require('mongodb');
// // const uri = "mongodb://localhost:27017";
// const uri = "mongodb+srv://keerthuvije:ZEZS1JlZIvPPwkPe@cluster0.avmbigb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// let port = process.env.port || 3040;
// let collection;

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
// async function runDBConnection() {
//     try {
//         await client.connect();
//         collection = client.db().collection('Booking');
//         console.log(collection);
//     } catch(ex) {
//         console.error(ex);
//     }
// }

// // Define a schema and model for items
// const bookingSchema = new mongoose.Schema({
//     name: String,
//     phone: String,
//     date: String,
//     time: String
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// // Exporting our model objects
// module.exports = {
//     Booking,
//     runDBConnection
// };

//New Connection Code

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