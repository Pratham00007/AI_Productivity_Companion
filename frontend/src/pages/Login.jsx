import { useEffect, useRef } from "react";

function Login() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const login = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

        .login-root {
          min-height: 100vh;
          background: #0A0F1E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .login-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .login-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .login-card {
          position: relative;
          z-index: 10;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(99,102,241,0.25);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 56px 48px;
          width: 420px;
          text-align: center;
          animation: cardEntry 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardEntry {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #6366F1, #22D3EE);
          border-radius: 20px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          animation: pulse-icon 3s ease-in-out infinite;
          box-shadow: 0 0 32px rgba(99,102,241,0.4);
        }
        @keyframes pulse-icon {
          0%, 100% { box-shadow: 0 0 32px rgba(99,102,241,0.4); }
          50%       { box-shadow: 0 0 56px rgba(34,211,238,0.5); }
        }
        .login-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #F8FAFC;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }
        .login-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 0 0 36px;
          line-height: 1.6;
        }
        .login-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 36px;
          text-align: left;
        }
        .login-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #94A3B8;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .login-feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22D3EE;
          flex-shrink: 0;
        }
        .login-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366F1, #4F46E5);
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
          position: relative;
          overflow: hidden;
        }
        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.5); }
        .login-btn:hover::after { opacity: 1; }
        .login-btn:active { transform: translateY(0); }
        .google-icon {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: #4F46E5;
          flex-shrink: 0;
        }
        .login-footer {
          margin-top: 24px;
          font-size: 12px;
          color: #334155;
        }
      `}</style>

      <div className="login-root">
        <canvas ref={canvasRef} className="login-canvas" />
        <div className="login-glow" />

        <div className="login-card">
          <div className="login-icon">⚡</div>
          <h1 className="login-title">AI Productivity Companion</h1>
          <p className="login-subtitle">
            Turn your inbox into an intelligent action plan — powered by Gemini AI
          </p>

          <div className="login-features">
            {[
              "Reads Gmail & extracts tasks automatically",
              "Syncs events to Google Calendar",
              "AI-generated preparation & learning plans",
            ].map((f) => (
              <div className="login-feature" key={f}>
                <div className="login-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          <button className="login-btn" onClick={login}>
            <div className="google-icon">G</div>
            Continue with Google
          </button>

          <p className="login-footer">Secure OAuth 2.0 · No passwords stored</p>
        </div>
      </div>
    </>
  );
}

export default Login;