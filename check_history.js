const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const TestResult = require("./models/TestResult");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/typeflow", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // List all users
    const users = await User.find();
    console.log("Users:", users);

    // Count test results
    const resultCount = await TestResult.countDocuments();
    console.log(`Total Test Results: ${resultCount}`);

    // List all results
    const results = await TestResult.find().populate("user", "username email");
    console.log("Test Results:", JSON.stringify(results, null, 2));

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    mongoose.disconnect();
  });
