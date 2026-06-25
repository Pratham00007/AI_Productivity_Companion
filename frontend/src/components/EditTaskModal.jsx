import { useState } from "react";
import api from "../services/api";

function EditTaskModal({
  task,
  onClose,
  onUpdated,
}) {

  const [form, setForm] = useState({
    title: task.title || "",
    deadline: task.deadline?.slice(0,10) || "",
    priority: task.priority || "Medium",
    category: task.category || "General",
    estimatedHours: task.estimatedHours || 1,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = async () => {

    const res = await api.put(
      `/api/tasks/${task._id}`,
      form
    );

    onUpdated(res.data);
    onClose();
  };

  const deleteTask = async () => {

    await api.delete(
      `/api/tasks/${task._id}`
    );

    onUpdated(null); // remove in UI
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          background: "white",
          width: "420px",
          margin: "80px auto",
          padding: "20px",
          borderRadius: "10px",
        }}
      >

        <h2>Edit Task</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
        />

        <input
          name="priority"
          value={form.priority}
          onChange={handleChange}
          placeholder="Priority"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          name="estimatedHours"
          type="number"
          value={form.estimatedHours}
          onChange={handleChange}
        />

        <div style={{ marginTop: "15px" }}>

          <button onClick={save}>
            Save
          </button>

          <button
            onClick={deleteTask}
            style={{
              marginLeft: "10px",
              background: "red",
              color: "white",
            }}
          >
            Delete
          </button>

          <button
            onClick={onClose}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}

export default EditTaskModal;