import { useState, useEffect } from "react";
import css from "./styles/global";
import { COLORS } from "./styles/tokens";
import { NAV } from "./data/mockData";
import { logout, restoreSession } from "./api/auth.api";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import NutritionPage from "./pages/NutritionPage";
import AICoachPage from "./pages/AICoachPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";

const PAGE_LABELS = {
  dashboard: "Dashboard", workouts: "Workouts", nutrition: "Nutrition",
  "ai-coach": "AI Coach", analytics: "Analytics", profile: "Profile",
};

// Bottom nav shows only 5 key pages on mobile
const BOTTOM_NAV = [
  { id: "dashboard",  icon: "🏠", label: "Home" },
  { id: "workouts",   icon: "💪", label: "Workout" },
  { id: "nutrition",  icon: "🥗", label: "Nutrition" },
  { id: "ai-coach",   icon: "🤖", label: "AI Coach" },
  { id: "profile",    icon: "👤", label: "Profile" },
];

export default function App() {
  const [user, setUser]           = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [checking, setChecking]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [...new Set(NAV.map(n => n.section))];

  // ── Restore session on page refresh ───────
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await restoreSession();
        if (token) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/user/me`,
            { credentials: "include", headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (data.success) {
            setUser({ id: data.data.id, name: data.data.name, email: data.data.email });
          }
        }
      } catch { /* no session */ }
      finally { setChecking(false); }
    };
    checkSession();
  }, []);

  // ── Auto logout listener ───────────────────
  useEffect(() => {
    const handle = () => { setUser(null); setPage("dashboard"); };
    window.addEventListener("auth:logout", handle);
    return () => window.removeEventListener("auth:logout", handle);
  }, []);

  // ── Close sidebar on page change (mobile) ──
  const handlePageChange = (id) => {
    setPage(id);
    setSidebarOpen(false);
  };

  const handleLogin  = (userData) => setUser(userData);
  const handleLogout = async () => { await logout(); setUser(null); setPage("dashboard"); };

  if (checking) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#8888AA", fontSize: 14 }}>Loading...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style>{css}</style>
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  const avatarLetter = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">

        {/* Sidebar overlay (mobile backdrop) */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {/* Close button — only visible on mobile */}
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>

          <div className="sidebar-logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">Fit<span>AI</span> Pro</div>
          </div>
          <div className="sidebar-nav">
            {sections.map(section => (
              <div key={section}>
                <div className="nav-section-label">{section}</div>
                {NAV.filter(n => n.section === section).map(item => (
                  <button
                    key={item.id}
                    className={`nav-item ${page === item.id ? "active" : ""}`}
                    onClick={() => handlePageChange(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                    {item.id === "ai-coach" && (
                      <span className="tag lime" style={{ marginLeft: "auto", padding: "1px 6px", fontSize: 10 }}>AI</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-user" onClick={() => handlePageChange("profile")}>
            <div className="user-avatar">{avatarLetter}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-goal">{user.email}</div>
            </div>
            <div style={{ color: COLORS.textMuted, fontSize: 14 }}>⚙</div>
          </div>
        </nav>

        {/* Main content */}
        <div className="main">
          <div className="topbar">
            {/* Hamburger — visible on tablet/mobile */}
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
            <div className="topbar-title">{PAGE_LABELS[page]}</div>
            <div className="topbar-actions">
              <div className="icon-btn" style={{ position: "relative" }}>
                🔔<div className="notif-dot" />
              </div>
              <div className="icon-btn" onClick={handleLogout} title="Logout">🚪</div>
            </div>
          </div>

          {page === "dashboard" && <DashboardPage user={user} onNavigate={setPage} />}
          {page === "workouts"   && <WorkoutsPage />}
          {page === "nutrition"  && <NutritionPage />}
          {page === "ai-coach"   && <AICoachPage user={user} />}
          {page === "analytics"  && <AnalyticsPage />}
          {page === "profile"    && <ProfilePage user={user} />}
        </div>

        {/* Bottom navigation — only visible on mobile */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {BOTTOM_NAV.map(item => (
              <button
                key={item.id}
                className={`bottom-nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => handlePageChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

      </div>
    </>
  );
}