// backend/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
    try{
    console.log(`Attempting to connect to MongoDB...`.cyan);

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    console.error(
      "Please make sure MongoDB is running and the connection string is correct"
        .red,
    );
    process.exit(1);
  }
};

module.exports = connectDB;
