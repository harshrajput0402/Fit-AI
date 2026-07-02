import { useState, useEffect } from "react";
import { COLORS } from "../styles/tokens";
import { BarChart, LineChart } from "../components/Charts";
import { getWeeklyAnalytics, getMonthlyAnalytics } from "../api/analytics.api";
import { Dumbbell, Moon, Flame, Droplets, Scale, TrendingDown, TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target } from "lucide-react";

const INSIGHT_ICONS = {
  "🔥": <Flame size={18} color={COLORS.lime} />,
  "✅": <CheckCircle size={18} color="#00FF88" />,
  "💡": <Lightbulb size={18} color={COLORS.amber} />,
  "⚠️": <AlertTriangle size={18} color={COLORS.rose} />,
  "💧": <Droplets size={18} color={COLORS.cyan} />,
  "📉": <TrendingDown size={18} color={COLORS.lime} />,
  "📈": <TrendingUp size={18} color={COLORS.rose} />,
  "🎯": <Target size={18} color={COLORS.violet} />,
};

const MUSCLE_ICONS = {
  Chest: "🫁",
  Back: "💪",
  Legs: "🦵",
  Shoulders: "🏔️",
  Arms: "💪",
  Core: "🔥",
  "Full Body": "🏋️",
};

const MUSCLE_COLORS = [COLORS.lime, COLORS.cyan, COLORS.violet, COLORS.amber, "#FF6B6B", COLORS.rose];

export default function AnalyticsPage() {
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [weeklyData, monthlyData] = await Promise.all([
          getWeeklyAnalytics(),
          getMonthlyAnalytics(),
        ]);
        setWeekly(weeklyData);
        setMonthly(monthlyData);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.textSecondary }}>Loading analytics...</div>
      </div>
    );
  }

  // ── Weekly chart data ──────────────────────
  const weeklyCalChart = weekly?.days?.map(d => ({
    day: d.label, consumed: d.calories, burned: 0,
  })) || [];

  // ── Monthly calorie chart ──────────────────
  const monthlyCalChart = monthly?.weeklyCalories?.map(w => ({
    day: w.week, consumed: w.calories, burned: 0,
  })) || [];

  // ── Weight trend ───────────────────────────
  const weightTrend = monthly?.weightTrend?.map(w => ({
    day: new Date(w.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: w.weightKg,
  })) || [];

  // ── Muscle group breakdown ─────────────────
  const muscleGroups = monthly?.muscleGroups
    ? Object.entries(monthly.muscleGroups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    : [];
  const maxSessions = muscleGroups[0]?.[1] || 1;

  // ── Weight lost this month ─────────────────
  const weightLogs = monthly?.weightTrend || [];
  const weightChange = weightLogs.length >= 2
    ? (weightLogs[0].weightKg - weightLogs[weightLogs.length - 1].weightKg).toFixed(1)
    : null;

  // ── Month label ────────────────────────────
  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // ── Generate AI insights from real data ───
  const insights = [];
  if (weekly?.summary?.avgCalories > 0) {
    insights.push({
      icon: "🔥",
      title: "Weekly calorie average",
      body: `Your average daily intake this week is ${weekly.summary.avgCalories} kcal.`,
    });
  }
  if (weekly?.summary?.totalWorkouts >= 4) {
    insights.push({
      icon: "✅",
      title: "Great workout consistency",
      body: `You completed ${weekly.summary.totalWorkouts} workouts this week. Keep it up!`,
    });
  } else if (weekly?.summary?.totalWorkouts > 0) {
    insights.push({
      icon: "💡",
      title: "Room to improve workouts",
      body: `You did ${weekly.summary.totalWorkouts} workout${weekly.summary.totalWorkouts > 1 ? "s" : ""} this week. Try to aim for 4-5 sessions.`,
    });
  }
  if (weekly?.summary?.avgWater >= 6) {
    insights.push({
      icon: "💧",
      title: "Good hydration",
      body: `Averaging ${weekly.summary.avgWater} glasses/day this week. Great habit!`,
    });
  } else {
    insights.push({
      icon: "⚠️",
      title: "Drink more water",
      body: `You're averaging ${weekly.summary.avgWater || 0} glasses/day. Try to hit 8 glasses daily.`,
    });
  }
  if (weightChange !== null) {
    insights.push({
      icon: Number(weightChange) > 0 ? "📈" : "📉",
      title: Number(weightChange) > 0 ? "Weight increased" : "Weight decreased",
      body: `You ${Number(weightChange) > 0 ? "gained" : "lost"} ${Math.abs(weightChange)}kg this month.`,
    });
  }
  // Fallback if no data
  if (insights.length === 0) {
    insights.push(
      { icon: "🎯", title: "Start logging data", body: "Log meals, workouts and weight to see personalized insights here." },
      { icon: "💡", title: "Tip", body: "Consistency is key — even logging just your weight daily helps track progress." },
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Analytics</div>
          <div className="page-subtitle">Weekly & monthly performance insights</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm">📊 Export PDF</button>
          <button className="btn btn-secondary btn-sm">📁 Export CSV</button>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#ff5050" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          {
            label: "Avg Daily Calories",
            val: weekly?.summary?.avgCalories ? `${weekly.summary.avgCalories.toLocaleString()}` : "—",
            delta: "this week",
            dir: "neutral",
            icon: <Flame size={20} color={COLORS.lime} />,
          },
          {
            label: "Total Workouts",
            val: monthly?.totalWorkouts ?? "—",
            delta: "this month",
            dir: "up",
            icon: <Dumbbell size={20} color={COLORS.violet} />,
          },
          {
            label: "Avg Water",
            val: weekly?.summary?.avgWater ? `${weekly.summary.avgWater} glasses` : "—",
            delta: "daily average",
            dir: weekly?.summary?.avgWater >= 6 ? "up" : "down",
            icon: <Droplets size={20} color={COLORS.cyan} />,
          },
          {
            label: "Weight Change",
            val: weightChange !== null ? `${weightChange > 0 ? "+" : ""}${weightChange}kg` : "—",
            delta: "this month",
            dir: weightChange < 0 ? "up" : "down",
            icon: <Scale size={20} color={COLORS.amber} />,
          },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-delta ${s.dir}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Monthly Calorie Trend</div>
            <span className="tag lime">{monthLabel}</span>
          </div>
          <div className="chart-area">
            {monthlyCalChart.some(d => d.consumed > 0)
              ? <BarChart data={monthlyCalChart} height={150} />
              : <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", paddingTop: 50 }}>No meal data yet — log some meals!</div>
            }
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weight Journey</div>
            <span style={{ fontSize: 12, color: COLORS.lime }}>
              {weightChange !== null ? `${weightChange > 0 ? "+" : ""}${weightChange}kg this month` : "Log weight to track"}
            </span>
          </div>
          <div className="chart-area">
            {weightTrend.length >= 2
              ? <LineChart data={weightTrend} height={150} />
              : <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", paddingTop: 50 }}>Log your weight in Profile to see trend</div>
            }
          </div>
        </div>
      </div>

      {/* Muscle split + insights */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Workout Split This Month</div>
          {muscleGroups.length === 0 ? (
            <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              Complete some workouts to see your muscle group breakdown
            </div>
          ) : (
            muscleGroups.map(([muscle, sessions], i) => (
              <div key={muscle} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 20 }}>{MUSCLE_ICONS[muscle] || "💪"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{muscle}</span>
                    <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{sessions} exercises</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(sessions / maxSessions) * 100}%`, "--fill-color": MUSCLE_COLORS[i] || COLORS.lime }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Insights</div>
          {insights.map((insight, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < insights.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                {INSIGHT_ICONS[insight.icon] || <Lightbulb size={18} color={COLORS.amber} />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 3 }}>{insight.title}</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5 }}>{insight.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly breakdown */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title" style={{ marginBottom: 16 }}>This Week — Day by Day</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {(weekly?.days || []).map((day, i) => (
            <div key={i} style={{ textAlign: "center", background: COLORS.surface, borderRadius: 10, padding: "10px 6px", border: `1px solid ${day.workedOut ? COLORS.lime + "44" : COLORS.border}` }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>{day.label}</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                {day.workedOut
                  ? <Dumbbell size={20} color={COLORS.lime} />
                  : <Moon size={20} color={COLORS.textMuted} />
                }
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: day.calories > 0 ? COLORS.lime : COLORS.textMuted }}>
                {day.calories > 0 ? `${day.calories}` : "—"}
              </div>
              <div style={{ fontSize: 9, color: COLORS.textMuted }}>kcal</div>
              {day.weightKg && (
                <div style={{ fontSize: 10, color: COLORS.cyan, marginTop: 2 }}>{day.weightKg}kg</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}