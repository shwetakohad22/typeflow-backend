const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/typeflow", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoute = require("./routes/auth");
const testsRoute = require("./routes/tests");

// Routes
app.use("/api/auth", authRoute);
app.use("/api/tests", testsRoute);

app.get("/", (req, res) => {
  res.send("TypeFlow API Running");
});

// Socket.io

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
