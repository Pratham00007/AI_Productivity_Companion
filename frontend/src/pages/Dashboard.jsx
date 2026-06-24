import { useEffect, useState } from "react";

import api from "../services/api";
import TaskCard from "../components/TaskCard";
import Progress from "../components/Progress";

function Dashboard() {
  const [loading, setLoading] =
    useState(true);

  const [tasks, setTasks] =
    useState([]);

  const [user, setUser] =
    useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {

      const profile =
        await api.get("/auth/me");

      setUser(profile.data.user);

      const scan =
        await api.get(
          "/api/email/scan"
        );

      setTasks(scan.data.tasks);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1>
        AI Productivity Dashboard
      </h1>

      {user && (
        <h3>
          Welcome {user.name}
        </h3>
      )}

      {loading && <Progress />}

      {!loading &&
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
          />
        ))}
    </div>
  );
}

export default Dashboard;