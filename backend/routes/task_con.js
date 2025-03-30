const express = require("express");
const Task = require("../models/task");
const authenticateUser = require("./middleware"); // Correct path to the middleware

const router = express.Router();

// Get the logged-in user's details

// Create a new task
router.post("/", authenticateUser, async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user._id }); // Associate task with user
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tasks for the logged-in user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }); // Filter tasks by userId
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single task by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id }); // Ensure task belongs to user
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a task (general update)

router.put("/:id/mark", authenticateUser, async (req, res) => {
    try {
      console.log("Request Params:", req.params); // Debugging: Log the request params
      console.log("Request Body:", req.body); // Debugging: Log the request body
      console.log("User ID:", req.user._id); // Debugging: Log the user ID
  
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id }, // Ensure task belongs to user
        { completed: req.body.completed }, // Update the completed status
        { new: true } // Return the updated task
      );
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json(task);
    } catch (err) {
      console.error("Error marking task as completed:", err); // Debugging: Log the error
      res.status(400).json({ message: err.message });
    }
  });

// Delete a task
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id }); // Ensure task belongs to user
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;