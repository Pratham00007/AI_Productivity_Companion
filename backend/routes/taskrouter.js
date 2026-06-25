const express = require("express");
const router = express.Router();
const auth =
require("../middleware/auth");
const { updateTaskEvent } = require("../utils/calendar");
const Task = require("../models/Task");
const User = require("../models/User");

const { google } = require("googleapis");
const { createCalendarClient } = require("../utils/calendar");

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
router.put("/:id", async (req, res) => {
  try {

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: "after" }
      );

    const user =
      await User.findById(
        updatedTask.userId
      );

    // sync calendar only if exists
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
      error: error.message,
    });
  }
});


// DELETE task
router.delete("/:id", async (req, res) => {
  try {

    const task =
      await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // delete from calendar if exists
    if (task.calendarEventId) {

      const user =
        await User.findById(task.userId);

      const calendar =
        createCalendarClient(user);

      await calendar.events.delete({
        calendarId: "primary",
        eventId: task.calendarEventId,
      });
    }

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;