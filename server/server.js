const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/skills", require("./routes/skill"));
app.use("/api/requests", require("./routes/request"));

app.listen(5000, "0.0.0.0", () =>
  console.log("🚀 Server running on port 5000")
);
