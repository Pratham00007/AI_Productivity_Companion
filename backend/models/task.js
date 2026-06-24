const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    deadline: {
      type: Date,
    },

    priority: {
      type: String,
      default: "Medium",
    },

    category: {
  type: String,
  default: "General",
},

estimatedHours: {
  type: Number,
  default: 1,
},

topics: [String],

preparationPlan: [
  {
    task: String,
    daysBefore: Number,
  },
],

    status: {
      type: String,
      default: "Pending",
    },

    calendarEventId: {
  type: String,
},
sourceEmailId: {
  type: String,
  unique: true,
  sparse: true,
},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);