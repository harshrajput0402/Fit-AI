import { useState } from "react";
import { COLORS } from "../styles/tokens";
import { login, register } from "../api/auth.api";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin]   = useState(true);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [form, setForm]           = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError(""); // clear error on any input change
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    // Basic frontend validation
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (!isLogin && !form.name) {
      setError("Full name is required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login({ email: form.email, password: form.password });
      } else {
        user = await register({ name: form.name, email: form.email, password: form.password });
      }
      onLogin(user); // pass user up to App.jsx
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Allow submitting with Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🏋️</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.textPrimary, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16 }}>
            Your body.<br /><span style={{ color: COLORS.lime }}>Your data.</span><br />Your coach.
          </div>
          <div style={{ fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.7, maxWidth: 360 }}>
            FitAI Pro tracks every rep, every macro, and every milestone — with an AI coach that knows your exact profile and adapts as you progress.
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
            {[["🔥", "14-day", "streak average"], ["💪", "94%", "goal completion"], ["🤖", "AI coach", "24/7 available"]].map(([icon, val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.lime, marginTop: 6 }}>{val}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <div className="logo-icon">⚡</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Fit<span style={{ color: COLORS.lime }}>AI</span> Pro</div>
          </div>
          <div className="auth-title">{isLogin ? "Welcome back" : "Start your journey"}</div>
          <div className="auth-subtitle">{isLogin ? "Sign in to your fitness dashboard" : "Create your free account today"}</div>

          {/* Error message */}
          {error && (
            <div style={{
              background: "rgba(255,80,80,0.1)",
              border: "1px solid rgba(255,80,80,0.3)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 13,
              color: "#ff5050",
            }}>
              ⚠️ {error}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                name="name"
                placeholder="Alex Rivera"
                value={form.name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", fontSize: 16,
                  color: COLORS.textMuted, padding: 0,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {isLogin && (
            <div style={{ textAlign: "right", marginBottom: 16, marginTop: -8 }}>
              <span style={{ fontSize: 12, color: COLORS.lime, cursor: "pointer" }}>Forgot password?</span>
            </div>
          )}

          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15, opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? (isLogin ? "Signing in..." : "Creating account...")
              : (isLogin ? "Sign In →" : "Create Account →")
            }
          </button>

          <div className="divider">or continue with</div>
          <button className="btn btn-secondary w-full" style={{ width: "100%", justifyContent: "center" }}>🔑 Google</button>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: COLORS.textSecondary }}>
            {isLogin ? "New to FitAI Pro? " : "Already have an account? "}
            <span
              style={{ color: COLORS.lime, cursor: "pointer", fontWeight: 600 }}
              onClick={() => { setIsLogin(!isLogin); setError(""); setForm({ name: "", email: "", password: "" }); setShowPassword(false); }}
            >
              {isLogin ? "Sign up free" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}