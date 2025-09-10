const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

const connectToDB = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log("Connected to db successfully");
    } catch (error) {
        console.error("Error connecting to Mongo:", error);
        process.exit(1);
    }
};

module.exports = connectToDB;