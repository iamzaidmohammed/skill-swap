const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
