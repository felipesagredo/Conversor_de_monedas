// src/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Connection to MongoDB failed:', error.message);
    }
};

export default connectDB;
