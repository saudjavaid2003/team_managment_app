const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
        });
        console.log('MongoDB connection successful ✅');
    } catch (error) {
        console.error('MongoDB connection failed ❌', error.message);
        process.exit(1); // Exit the process if connection fails
    }
};



module.exports = connectDB;
