import { useEffect, useState } from "react";
import api from "../services/api";

import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";
import Progress from "../components/Progress";

const SCAN_STATES = {
  loading:   { icon: "⏳", color: "#94A3B8", pulse: false },
  scanning:  { icon: "🔄", color: "#6366F1", pulse: true  },
  calendar:  { icon: "📅", color: "#22D3EE", pulse: true  },
  done:      { icon: "✅", color: "#34D399", pulse: false },
  error:     { icon: "❌", color: "#F87171", pulse: false },
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanStatus, setScanStatus] = useState("Loading dashboard…");
  const [scanState, setScanState] = useState("loading");
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => { initializeDashboard(); }, []);

  const initializeDashboard = async () => {
    try {
      const profile = await api.get("/auth/me");
      setUser(profile.data.user);
      const existingTasks = await api.get("/api/tasks");
      setTasks(existingTasks.data);
      setLoading(false);
      scanForNewEmails();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setScanStatus("Failed to load dashboard");
      setScanState("error");
    }
  };

  const scanForNewEmails = async () => {
    try {
      setScanState("scanning");
      setScanStatus("Scanning Gmail for new emails…");
      await api.get("/api/email/scan");
      setScanState("calendar");
      setScanStatus("Syncing Google Calendar…");
      const latestTasks = await api.get("/api/tasks");
      setTasks(latestTasks.data);
      setScanState("done");
      setScanStatus("Scan complete — all tasks up to date");
    } catch (error) {
      console.log(error);
      setScanState("error");
      setScanStatus("Scan failed — check your connection");
    }
  };

  const priorities = ["All", "High", "Medium", "Low"];
  const filteredTasks = filter === "All" ? tasks : tasks.filter((t) => t.priority === filter);

  const stats = {
    total:    tasks.length,
    high:     tasks.filter((t) => t.priority === "High").length,
    synced:   tasks.filter((t) => t.calendarEventId).length,
    pending:  tasks.filter((t) => !t.calendarEventId).length,
  };

  const { icon: scanIcon, color: scanColor, pulse } = SCAN_STATES[scanState] || SCAN_STATES.loading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #0A0F1E;
          font-family: 'Inter', sans-serif;
          color: #F1F5F9;
        }

        /* ── TOP NAV ── */
        .dash-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366F1, #22D3EE);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 16px rgba(99,102,241,0.35);
        }
        .nav-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #F8FAFC;
        }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366F1, #22D3EE);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .nav-user-info { display: flex; flex-direction: column; }
        .nav-user-name { font-size: 13px; font-weight: 600; color: #F1F5F9; }
        .nav-user-email { font-size: 11px; color: #475569; }

        /* ── MAIN ── */
        .dash-main { max-width: 900px; margin: 0 auto; padding: 28px 20px; }

        /* ── STATS STRIP ── */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px 18px;
          animation: cardSlide 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardSlide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-label { font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
        .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; color: #F8FAFC; line-height: 1; }
        .stat-card:nth-child(2) .stat-value { color: #F87171; }
        .stat-card:nth-child(3) .stat-value { color: #34D399; }
        .stat-card:nth-child(4) .stat-value { color: #FBBF24; }

        /* ── SCAN STATUS ── */
        .scan-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
          transition: border-color 0.4s;
        }
        .scan-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .scan-indicator.pulsing {
          animation: dotPulse 1.4s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .scan-icon { font-size: 16px; }
        .scan-text { font-size: 13px; font-weight: 500; flex: 1; }
        .rescan-btn {
          padding: 6px 14px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 8px;
          color: #A5B4FC;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .rescan-btn:hover { background: rgba(99,102,241,0.2); }

        /* ── FILTER BAR ── */
        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .filter-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #F8FAFC;
        }
        .filter-pills { display: flex; gap: 6px; }
        .filter-pill {
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.05);
          color: #64748B;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .filter-pill:hover { color: #94A3B8; background: rgba(255,255,255,0.08); }
        .filter-pill.active {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.35);
          color: #A5B4FC;
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          border-style: dashed;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; color: #334155; margin-bottom: 8px; }
        .empty-sub { font-size: 13px; color: #1E293B; }

        @media (max-width: 600px) {
          .stats-strip { grid-template-columns: repeat(2, 1fr); }
          .filter-bar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .nav-user-info { display: none; }
        }
      `}</style>

      <div className="dash-root">
        {/* NAV */}
        <nav className="dash-nav">
          <div className="nav-brand">
            <div className="nav-logo">⚡</div>
            <div className="nav-title">AI Productivity Companion</div>
          </div>
          {user && (
            <div className="nav-user">
              <div className="nav-user-info">
                <div className="nav-user-name">{user.name}</div>
                <div className="nav-user-email">{user.email}</div>
              </div>
              <div className="nav-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </nav>

        <main className="dash-main">

          {/* STATS */}
          <div className="stats-strip">
            {[
              { label: "Total Tasks",    value: stats.total   },
              { label: "High Priority",  value: stats.high    },
              { label: "Cal. Synced",    value: stats.synced  },
              { label: "Not Synced",     value: stats.pending },
            ].map((s, i) => (
              <div className="stat-card" key={s.label} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* SCAN STATUS */}
          <div className="scan-bar" style={{ borderColor: `${scanColor}22` }}>
            <div
              className={`scan-indicator${pulse ? " pulsing" : ""}`}
              style={{ background: scanColor }}
            />
            <span className="scan-icon">{scanIcon}</span>
            <span className="scan-text" style={{ color: scanColor }}>{scanStatus}</span>
            {scanState === "done" || scanState === "error" ? (
              <button className="rescan-btn" onClick={scanForNewEmails}>Re-scan</button>
            ) : null}
          </div>

          {/* LOADING */}
          {loading && <Progress />}

          {/* TASKS */}
          {!loading && (
            <>
              <div className="filter-bar">
                <div className="filter-label">
                  Tasks{" "}
                  <span style={{ color: "#334155", fontWeight: 400, fontSize: "14px" }}>
                    ({filteredTasks.length})
                  </span>
                </div>
                <div className="filter-pills">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      className={`filter-pill${filter === p ? " active" : ""}`}
                      onClick={() => setFilter(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <div className="empty-title">
                    {filter === "All" ? "No tasks yet" : `No ${filter} priority tasks`}
                  </div>
                  <div className="empty-sub">
                    {filter === "All"
                      ? "Your AI assistant will extract tasks from your inbox automatically"
                      : "Try a different filter"}
                  </div>
                </div>
              ) : (
                filteredTasks.map((task, i) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={setEditingTask}
                    index={i}
                  />
                ))
              )}
            </>
          )}
        </main>
      </div>

      {/* EDIT MODAL */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={(updatedTask) => {
            if (!updatedTask) {
              setTasks(tasks.filter((t) => t._id !== editingTask._id));
            } else {
              setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
            }
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}

export default Dashboard;