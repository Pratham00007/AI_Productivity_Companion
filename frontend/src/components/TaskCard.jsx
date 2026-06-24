function TaskCard({ task }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
      }}
    >
      <h2>{task.title}</h2>

      <p>
        Priority: {task.priority}
      </p>

      <p>
        Category: {task.category}
      </p>

      <p>
        Hours: {task.estimatedHours}
      </p>

      <p>
        Deadline:
        {" "}
        {task.deadline
          ? new Date(
              task.deadline
            ).toLocaleDateString()
          : "No deadline"}
      </p>

      <div>
        {task.calendarEventId ? (
          <span
            style={{
              color: "green",
            }}
          >
            ✅ Added To Calendar
          </span>
        ) : (
          <span
            style={{
              color: "red",
            }}
          >
            ❌ Not Synced
          </span>
        )}
      </div>
    </div>
  );
}

export default TaskCard;