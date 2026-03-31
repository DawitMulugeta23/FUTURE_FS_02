const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error("MONGODB_URI is not defined in environment variables".red);
      console.error(
        "Please check your .env file and make sure it exists in the backend folder"
          .red,
      );
      process.exit(1);
    }

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
