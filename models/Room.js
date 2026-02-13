const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      socketId: String,
      wpm: { type: Number, default: 0 },
      progress: { type: Number, default: 0 }, // percentage
      isReady: { type: Boolean, default: false },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  text: String, // The text passage for the race
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Expire after 1 hour
  },
});

module.exports = mongoose.model("Room", roomSchema);
