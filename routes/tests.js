const router = require("express").Router();
const TestResult = require("../models/TestResult");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

// Save Test Result (Keep only best)
router.post("/save", auth, async (req, res) => {
  try {
    const { wpm, accuracy, duration, difficulty } = req.body;
    console.log("Processing test result for user:", req.user.id, { wpm });

    // Find current best
    const currentBest = await TestResult.findOne({ user: req.user.id }).sort({
      wpm: -1,
    });

    if (currentBest) {
      if (wpm > currentBest.wpm) {
        // New record is better, update the existing best (or delete all and save new)
        // To be safe and clean, let's delete all previous and save the new one
        await TestResult.deleteMany({ user: req.user.id });

        const newResult = new TestResult({
          user: req.user.id,
          wpm,
          accuracy,
          duration,
          difficulty,
        });
        const savedResult = await newResult.save();
        return res.json(savedResult);
      } else {
        // New record is not better.
        // OPTIONAL: Clean up any duplicate/inferior records if they exist, keeping just the best
        // This ensures "don't store any other thing" over time
        const allResults = await TestResult.find({ user: req.user.id });
        if (allResults.length > 1) {
          // Keep only currentBest, delete others
          await TestResult.deleteMany({
            user: req.user.id,
            _id: { $ne: currentBest._id },
          });
        }
        return res.json(currentBest);
      }
    } else {
      // No existing record, save new
      const newResult = new TestResult({
        user: req.user.id,
        wpm,
        accuracy,
        duration,
        difficulty,
      });
      const savedResult = await newResult.save();
      return res.json(savedResult);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User History
router.get("/history", auth, async (req, res) => {
  try {
    const history = await TestResult.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Best Score
router.get("/best", auth, async (req, res) => {
  try {
    const best = await TestResult.findOne({ user: req.user.id })
      .sort({ wpm: -1 })
      .limit(1);
    res.json(best || { wpm: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
