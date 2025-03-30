const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin"); // Import the Admin model
const authenticateAdmin = require("./authen_admin"); // Import the authentication middleware
const User = require("../models/user"); // Import the User model
const router = express.Router();

// Admin Login Route
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Admin login successful." });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/users", authenticateAdmin, async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Exclude passwords
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;