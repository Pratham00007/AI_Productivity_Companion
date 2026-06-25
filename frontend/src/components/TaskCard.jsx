import { useState } from "react";

const PRIORITY_CONFIG = {
  High:   { color: "#F87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.25)", badge: "#7F1D1D" },
  Medium: { color: "#FBBF24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  badge: "#78350F" },
  Low:    { color: "#34D399", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.25)",  badge: "#064E3B" },
};

function TaskCard({ task, onEdit, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const cfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;

  return (
    <>
      <style>{`
        .task-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px 22px;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          animation: cardSlide 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardSlide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .task-card-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          border-radius: 14px 0 0 14px;
          transition: width 0.2s ease;
        }
        .task-card:hover .task-card-accent { width: 4px; }
        .task-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .task-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #F1F5F9;
          line-height: 1.35;
          flex: 1;
        }
        .priority-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          border: 1px solid;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }
        .task-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #64748B;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 4px 10px;
          border-radius: 8px;
        }
        .task-chip-icon { font-size: 12px; }
        .task-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .topic-tag {
          font-size: 11px;
          color: #A5B4FC;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          padding: 3px 9px;
          border-radius: 6px;
        }
        .task-resources {
          margin-bottom: 16px;
        }
        .resources-title {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
        }
        .resource-item {
          font-size: 12px;
          color: #6366F1;
          padding: 3px 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .resource-item::before { content: '→'; color: #4F46E5; font-size: 10px; }
        .task-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .cal-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        .cal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .edit-btn {
          padding: 7px 16px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 8px;
          color: #A5B4FC;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        .edit-btn:hover {
          background: rgba(99,102,241,0.25);
          color: #C7D2FE;
          border-color: rgba(99,102,241,0.5);
        }
        .status-pill {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 9px;
          border-radius: 99px;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.2);
          color: #22D3EE;
        }
      `}</style>

      <div
        className="task-card"
        style={{
          animationDelay: `${index * 60}ms`,
          borderColor: hovered ? cfg.border : undefined,
          background: hovered ? cfg.bg : undefined,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="task-card-accent" style={{ background: cfg.color }} />

        <div className="task-top">
          <div className="task-title">{task.title}</div>
          <div
            className="priority-badge"
            style={{
              color: cfg.color,
              borderColor: cfg.border,
              background: cfg.bg,
            }}
          >
            {task.priority || "Medium"}
          </div>
        </div>

        <div className="task-meta">
          {task.category && (
            <div className="task-chip">
              <span className="task-chip-icon">🗂</span>
              {task.category}
            </div>
          )}
          {task.estimatedHours && (
            <div className="task-chip">
              <span className="task-chip-icon">⏱</span>
              {task.estimatedHours}h estimated
            </div>
          )}
          {task.deadline && (
            <div className="task-chip">
              <span className="task-chip-icon">📅</span>
              {new Date(task.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
          {task.status && <div className="status-pill">{task.status}</div>}
        </div>

        {task.topics?.length > 0 && (
          <div className="task-topics">
            {task.topics.map((t) => (
              <span className="topic-tag" key={t}>{t}</span>
            ))}
          </div>
        )}

        {task.resourceSuggestions?.length > 0 && (
          <div className="task-resources">
            <div className="resources-title">Resources</div>
            {task.resourceSuggestions.map((r, i) => (
              <div className="resource-item" key={i}>{r.title}</div>
            ))}
          </div>
        )}

        <div className="task-footer">
          <div className="cal-status">
            <div
              className="cal-dot"
              style={{
                background: task.calendarEventId ? "#34D399" : "#F87171",
                boxShadow: task.calendarEventId
                  ? "0 0 6px rgba(52,211,153,0.6)"
                  : "0 0 6px rgba(248,113,113,0.4)",
              }}
            />
            <span style={{ color: task.calendarEventId ? "#34D399" : "#94A3B8", fontSize: "12px" }}>
              {task.calendarEventId ? "Synced to Calendar" : "Not synced"}
            </span>
          </div>
          <button className="edit-btn" onClick={() => onEdit(task)}>
            Edit Task
          </button>
        </div>
      </div>
    </>
  );
}

export default TaskCard;