const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/typeflow", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB Connected");
    const users = await User.find({});
    console.log("Users found:", users.length);
    users.forEach((u) => console.log(`- ${u.username} (${u.email})`));
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
