const mongoose = require("mongoose");

//get Schema from mongoose
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  date_created: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model("User", UserSchema);
