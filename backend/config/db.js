const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true });
    console.log("Connected to database");
  } catch (err) {
    console.err(err.message);
    //exist process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
