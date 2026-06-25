function TaskCard({
  task,
  onEdit,
}) {

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
        Priority:
        {task.priority}
      </p>

      <p>
        Category:
        {task.category}
      </p>

      <p>
        Hours:
        {task.estimatedHours}
      </p>

      <p>
        Deadline:
        {" "}
        {task.deadline
          ? new Date(
              task.deadline
            ).toLocaleDateString()
          : "No Deadline"}
      </p>

      <p>
        Status:
        {" "}
        {task.status}
      </p>

      <h4>Topics</h4>

      <ul>
        {task.topics?.map(
          topic => (
            <li key={topic}>
              {topic}
            </li>
          )
        )}
      </ul>

      <h4>Resources</h4>

      <ul>
        {task.resourceSuggestions?.map(
          (r, index) => (
            <li key={index}>
              {r.title}
            </li>
          )
        )}
      </ul>

      {task.calendarEventId ? (
        <p
          style={{
            color: "green",
          }}
        >
          ✅ Added To Calendar
        </p>
      ) : (
        <p
          style={{
            color: "red",
          }}
        >
          ❌ Not Synced
        </p>
      )}

      <button
        onClick={() =>
          onEdit(task)
        }
      >
        Edit
      </button>

    </div>
  );
}

export default TaskCard;