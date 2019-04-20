const mongoose = require("mongoose");

// mongoose writer schema which is a description of how we want our data to look like
const writerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

// model which provide us with an interface for interacting with our data
const writerModel = mongoose.model("writer", writerSchema);
module.exports = writerModel;
