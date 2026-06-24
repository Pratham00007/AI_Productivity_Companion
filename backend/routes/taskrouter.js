const express = require("express");
const router = express.Router();
const auth =
require("../middleware/auth");
const { updateTaskEvent } = require("../utils/calendar");
const Task = require("../models/Task");
const User = require("../models/User");

// GET all tasks
router.get(
  "/",
  auth,
  async (req, res) => {
  const tasks = await Task.find({
    userId: req.user.id,
  }).sort({ deadline: 1 });

  res.json(tasks);
});

// UPDATE task
router.put(
  "/:id",
  auth,
  async (req, res) => {
  try {
    // 1. old task get karo
    const oldTask = await Task.findById(req.params.id);

    // 2. update task in DB
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // 3. user fetch karo
    const user = await User.findById(updatedTask.userId);

    // 4. calendar sync karo (IMPORTANT)
    if (updatedTask.calendarEventId) {
      await updateTaskEvent(
        user,
        updatedTask.calendarEventId,
        updatedTask
      );
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// DELETE task
router.delete(
  "/:id",
  auth,
  async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

module.exports = router;