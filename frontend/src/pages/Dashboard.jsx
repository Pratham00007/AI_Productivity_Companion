import { useEffect, useState } from "react";
import api from "../services/api";

import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";
import Progress from "../components/Progress";

function Dashboard() {

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanStatus, setScanStatus] = useState("Loading dashboard...");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff4d4f";
      case "Medium":
        return "#faad14";
      case "Low":
        return "#52c41a";
      default:
        return "#999";
    }
  };

  const initializeDashboard = async () => {
    try {

      // user
      const profile = await api.get("/auth/me");
      setUser(profile.data.user);

      // existing tasks FIRST
      const existingTasks = await api.get("/api/tasks");
      setTasks(existingTasks.data);

      setLoading(false);

      // background scan
      scanForNewEmails();

    } catch (error) {
      console.log(error);
      setLoading(false);
      setScanStatus("Failed to load dashboard");
    }
  };

  const scanForNewEmails = async () => {
    try {

      setScanStatus("🔄 Scanning Gmail for new emails...");

      await api.get("/api/email/scan");

      setScanStatus("📅 Syncing Calendar...");

      const latestTasks = await api.get("/api/tasks");
      setTasks(latestTasks.data);

      setScanStatus("✅ Scan Complete");

    } catch (error) {
      console.log(error);
      setScanStatus("❌ Scan Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "20px",
      }}
    >

      {/* HEADER */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h1>AI Productivity Assistant</h1>

        {user && (
          <>
            <h3>Welcome, {user.name}</h3>
            <p>{user.email}</p>
          </>
        )}

        <p>Total Tasks: {tasks.length}</p>
      </div>

      {/* SCAN STATUS */}
      <div
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      >
        <strong>{scanStatus}</strong>
      </div>

      {/* LOADING */}
      {loading && <Progress />}

      {/* TASK LIST */}
      {!loading && (
        <div>
          {tasks.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              No Tasks Found
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                priorityColor={getPriorityColor(task.priority)}
              />
            ))
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={(updatedTask) => {

            if (!updatedTask) {
              setTasks(tasks.filter(t => t._id !== editingTask._id));
              setEditingTask(null);
              return;
            }

            setTasks(
              tasks.map((t) =>
                t._id === updatedTask._id ? updatedTask : t
              )
            );
          }}
        />
      )}

    </div>
  );
}

export default Dashboard;