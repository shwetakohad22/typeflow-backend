const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // 30, 60, or 120
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TestResult", testResultSchema);
