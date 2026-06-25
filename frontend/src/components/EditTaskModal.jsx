import { useState } from "react";
import api from "../services/api";

function EditTaskModal({ task, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: task.title || "",
    deadline: task.deadline?.slice(0, 10) || "",
    priority: task.priority || "Medium",
    category: task.category || "General",
    estimatedHours: task.estimatedHours || 1,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/api/tasks/${task._id}`, form);
      onUpdated(res.data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/tasks/${task._id}`);
      onUpdated(null);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: overlayIn 0.2s ease;
        }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: #0F172A;
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 460px;
          font-family: 'Inter', sans-serif;
          animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .modal-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #F8FAFC;
          margin: 0;
        }
        .modal-close {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: #64748B;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .modal-close:hover { background: rgba(248,113,113,0.15); color: #F87171; border-color: rgba(248,113,113,0.3); }
        .field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .field-label { font-size: 12px; font-weight: 500; color: #64748B; text-transform: uppercase; letter-spacing: 0.6px; }
        .field-input, .field-select {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 11px 14px;
          color: #F1F5F9;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .field-input:focus, .field-select:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
        }
        .field-select { cursor: pointer; appearance: none; }
        .field-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .btn-save {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #6366F1, #4F46E5);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-delete {
          padding: 12px 18px;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: 10px;
          color: #F87171;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-delete:hover:not(:disabled) { background: rgba(248,113,113,0.18); border-color: rgba(248,113,113,0.4); }
        .btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-cancel {
          padding: 12px 16px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #64748B;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.04); color: #94A3B8; }
        .spinner-sm {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">
          <div className="modal-header">
            <h2 className="modal-title">Edit Task</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          <div className="field-group">
            <label className="field-label">Title</label>
            <input className="field-input" name="title" value={form.title} onChange={handleChange} placeholder="Task title…" />
          </div>

          <div className="two-col">
            <div className="field-group">
              <label className="field-label">Deadline</label>
              <input className="field-input" name="deadline" type="date" value={form.deadline} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">Estimated Hours</label>
              <input className="field-input" name="estimatedHours" type="number" min="0.5" step="0.5" value={form.estimatedHours} onChange={handleChange} />
            </div>
          </div>

          <div className="two-col">
            <div className="field-group">
              <label className="field-label">Priority</label>
              <select className="field-select field-input" name="priority" value={form.priority} onChange={handleChange}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Category</label>
              <input className="field-input" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Work" />
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-save" onClick={save} disabled={saving}>
              {saving ? <span className="spinner-sm" /> : "💾"}
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button className="btn-delete" onClick={deleteTask} disabled={deleting}>
              {deleting ? <span className="spinner-sm" style={{ borderTopColor: "#F87171" }} /> : "🗑"}
            </button>
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditTaskModal;