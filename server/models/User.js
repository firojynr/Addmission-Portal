const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minlegth: 6,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
