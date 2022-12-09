const mongoose = require("mongoose");

const timeSchema = mongoose.Schema({
  user: String,
  userTime: [
    {
      totalTime: Number,
      date: String,
    },
  ],
  time: { type: String },
});

module.exports = mongoose.model("Time", timeSchema);
