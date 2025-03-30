const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const Admin = require("../models/admin"); // Adjust the path to your Admin model
//quire("dotenv").config();
console.log("MongoDB URL:", process.env.mongo_url);

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ifti:rnWnkxMdaqpIflQ4@cluster1.ik9rmu5.mongodb.net/"
    );

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      mongoose.connection.close();
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("admin", 10); // Replace "adminpassword" with your desired password

    // Create the admin account
    const admin = new Admin({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin account created successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error creating admin account:", err);
    mongoose.connection.close();
  }
};

createAdmin();