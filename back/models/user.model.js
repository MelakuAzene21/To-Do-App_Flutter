const db = require('../config/db');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, "userName can't be empty"],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "userName format is not correct",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
}, { timestamps: true });

// Used while encrypting user-entered password
userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (err) {
    throw err;
  }
});

// Used during sign-in to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log('Comparing password:', this.password);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const UserModel = db.model('user', userSchema);
module.exports = UserModel;
