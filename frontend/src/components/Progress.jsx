import { useEffect, useState } from "react";

function Progress() {
  const [step, setStep] = useState(0);

  const steps = [
    { icon: "📩", label: "Reading Emails",           desc: "Fetching latest inbox messages" },
    { icon: "🤖", label: "Gemini Analysis",          desc: "Extracting actionable tasks with AI" },
    { icon: "📝", label: "Creating Tasks",           desc: "Building your task list" },
    { icon: "📅", label: "Creating Calendar Events", desc: "Scheduling in Google Calendar" },
    { icon: "✅", label: "Finalizing",               desc: "Wrapping everything up" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        .progress-wrap {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 16px;
          padding: 28px;
          backdrop-filter: blur(12px);
        }
        .progress-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #F8FAFC;
          margin: 0 0 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .progress-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(99,102,241,0.3);
          border-top-color: #6366F1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progress-bar-track {
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366F1, #22D3EE);
          border-radius: 99px;
          transition: width 1.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .progress-steps {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .progress-step {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          transition: all 0.4s ease;
        }
        .progress-step.done {
          background: rgba(34,211,238,0.06);
          border: 1px solid rgba(34,211,238,0.15);
        }
        .progress-step.active {
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.3);
          animation: stepPulse 1.5s ease-in-out infinite;
        }
        .progress-step.pending {
          background: transparent;
          border: 1px solid transparent;
        }
        @keyframes stepPulse {
          0%, 100% { background: rgba(99,102,241,0.08); }
          50%       { background: rgba(99,102,241,0.15); }
        }
        .step-icon {
          font-size: 18px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .progress-step.done   .step-icon { background: rgba(34,211,238,0.15); }
        .progress-step.active .step-icon { background: rgba(99,102,241,0.2); }
        .progress-step.pending .step-icon { opacity: 0.3; }
        .step-info { flex: 1; }
        .step-label {
          font-size: 13px;
          font-weight: 600;
          transition: color 0.3s;
        }
        .progress-step.done   .step-label { color: #22D3EE; }
        .progress-step.active .step-label { color: #A5B4FC; }
        .progress-step.pending .step-label { color: #334155; }
        .step-desc {
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }
        .step-check {
          font-size: 14px;
          transition: all 0.4s ease;
        }
        .progress-step.done   .step-check { color: #22D3EE; }
        .progress-step.active .step-check { color: #6366F1; animation: spin 1s linear infinite; }
        .progress-step.pending .step-check { color: #1E293B; }
      `}</style>

      <div className="progress-wrap">
        <h3 className="progress-heading">
          <span className="progress-spinner" />
          Scanning your inbox…
        </h3>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="progress-steps">
          {steps.map((s, i) => {
            const state = i < step ? "done" : i === step ? "active" : "pending";
            return (
              <div className={`progress-step ${state}`} key={i}>
                <div className="step-icon">{s.icon}</div>
                <div className="step-info">
                  <div className="step-label">{s.label}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
                <span className="step-check">
                  {state === "done" ? "✓" : state === "active" ? "◌" : "·"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Progress;