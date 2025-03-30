require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth_user");
const taskRoutes = require("./routes/task_con");
const adminRoutes = require("./routes/auth_admin"); 

dotenv.config();
const jwt = require("jsonwebtoken");
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging: Check if JWT_SECRET is loaded
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth_user", authRoutes);
app.use("/api/task_con", taskRoutes);
app.use("/api/auth_admin", adminRoutes); // Add this line to include admin routes
//p.use("/api/user",userRoutes); // Add this line to include user routes

// Connect to MongoDB
mongoose
  .connect(process.env.mongo_url)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
