import { useState, useEffect } from "react";
import { COLORS } from "../styles/tokens";
import { ProgressRing, BarChart, LineChart, MacroRow } from "../components/Charts";
import {
  getWeeklyAnalytics, getTodayNutrition, getHabits,
  toggleHabit, getTodayWater, logWater, getLatestBody,
} from "../api/dashboard.api";

const WATER_GOAL = 8;

export default function DashboardPage({ user, onNavigate }) {
  const [loading, setLoading]       = useState(true);
  const [weekly, setWeekly]         = useState(null);   // weekly analytics
  const [nutrition, setNutrition]   = useState(null);   // today's meals + totals
  const [habits, setHabits]         = useState([]);
  const [water, setWater]           = useState(0);      // total glasses today
  const [bodyLog, setBodyLog]       = useState(null);   // latest weight entry
  const [profile, setProfile]       = useState(null);   // from weekly summary

  // ── Load all dashboard data on mount ─────
  useEffect(() => {
    const load = async () => {
      try {
        const [weeklyData, nutritionData, habitsData, waterData, bodyData] = await Promise.all([
          getWeeklyAnalytics(),
          getTodayNutrition(),
          getHabits(),
          getTodayWater(),
          getLatestBody(),
        ]);
        setWeekly(weeklyData);
        setNutrition(nutritionData);
        setHabits(habitsData);
        setWater(waterData.totalGlasses || 0);
        setBodyLog(bodyData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Toggle habit done ─────────────────────
  const handleToggleHabit = async (id) => {
    try {
      await toggleHabit(id);
      // Refresh habits after toggle
      const updated = await getHabits();
      setHabits(updated);
    } catch (err) {
      console.error("Toggle habit error:", err);
    }
  };

  // ── Log a glass of water ──────────────────
  const handleLogWater = async (glassIndex) => {
    try {
      if (glassIndex >= water) {
        // Clicking an empty glass — add one
        await logWater(1);
        setWater(w => w + 1);
      }
      // Clicking a filled glass does nothing for now
    } catch (err) {
      console.error("Log water error:", err);
    }
  };

  // ── Derived values ────────────────────────
  const todayCalories   = nutrition?.totals?.calories  || 0;
  const todayProtein    = nutrition?.totals?.proteinG   || 0;
  const todayCarbs      = nutrition?.totals?.carbsG     || 0;
  const todayFats       = nutrition?.totals?.fatsG      || 0;
  const todayFiber      = nutrition?.totals?.fiberG     || 0;
  const todaySodium     = nutrition?.totals?.sodiumMg   || 0;
  const calorieGoal     = 2429; // from profile — hardcoded for now, will come from profile
  const remaining       = calorieGoal - todayCalories;
  const calPct          = Math.min((todayCalories / calorieGoal) * 100, 100);
  const doneHabits      = habits.filter(h => h.doneToday).length;

  // Weekly chart data formatted for charts
  const weeklyCalChart  = weekly?.days?.map(d => ({
    day:      d.label,
    consumed: d.calories,
    burned:   0, // calories burned not tracked yet
  })) || [];

  const weeklyWeightChart = weekly?.days
    ?.filter(d => d.weightKg)
    .map(d => ({ day: d.label, weight: d.weightKg })) || [];

  // Greeting based on time
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today    = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.textSecondary, fontSize: 15 }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">{greeting}, {user?.name?.split(" ")[0]} 👋</div>
          <div className="page-subtitle">{today} · Here's your daily summary</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="streak-badge">🔥 {weekly?.summary?.totalWorkouts || 0} workouts this week</div>
          <button className="btn btn-primary" onClick={() => onNavigate("workouts")}>+ Log Workout</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--accent": COLORS.lime, "--accent-dim": COLORS.limeDim }}>
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{todayCalories.toLocaleString()} <span>/ {calorieGoal.toLocaleString()}</span></div>
          <div className="stat-label">Calories Consumed</div>
          <div style={{ marginTop: 10 }}><div className="progress-bar"><div className="progress-fill" style={{ width: `${calPct}%` }} /></div></div>
          <div className="stat-delta neutral">{remaining > 0 ? `${remaining} remaining` : "Goal reached! 🎉"}</div>
        </div>
        <div className="stat-card" style={{ "--accent": COLORS.violet, "--accent-dim": COLORS.violetDim }}>
          <div className="stat-icon">💪</div>
          <div className="stat-value">{weekly?.summary?.totalWorkouts || 0} <span>this week</span></div>
          <div className="stat-label">Workouts Completed</div>
          <div className="stat-delta up">Keep it up!</div>
        </div>
        <div className="stat-card" style={{ "--accent": COLORS.cyan, "--accent-dim": COLORS.cyanDim }}>
          <div className="stat-icon">💧</div>
          <div className="stat-value">{water} <span>/ {WATER_GOAL} glasses</span></div>
          <div className="stat-label">Water Intake</div>
          <div style={{ marginTop: 10 }}><div className="progress-bar"><div className="progress-fill" style={{ width: `${(water / WATER_GOAL) * 100}%`, "--fill-color": COLORS.cyan }} /></div></div>
          <div className="stat-delta up">{Math.round((water / WATER_GOAL) * 100)}% of goal</div>
        </div>
        <div className="stat-card" style={{ "--accent": COLORS.amber, "--accent-dim": COLORS.amberDim }}>
          <div className="stat-icon">⚖️</div>
          <div className="stat-value">{bodyLog?.weightKg || "—"} <span>kg</span></div>
          <div className="stat-label">Current Weight</div>
          <div className="stat-delta neutral">{bodyLog ? "Last logged" : "Not logged yet"}</div>
        </div>
      </div>

      {/* Nutrition + body stats */}
      <div className="grid-21 mb-6">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Nutrition Overview</div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("nutrition")}>+ Log Meal</button>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 20 }}>
            <ProgressRing size={110} stroke={8} value={todayCalories} max={calorieGoal} color={COLORS.lime}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.textPrimary }}>{Math.round(calPct)}%</div>
                <div style={{ fontSize: 10, color: COLORS.textSecondary }}>consumed</div>
              </div>
            </ProgressRing>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                {[
                  { label: "Goal",      val: calorieGoal,    color: COLORS.textSecondary },
                  { label: "Consumed",  val: todayCalories,  color: COLORS.lime },
                  { label: "Remaining", val: Math.max(remaining, 0), color: COLORS.cyan },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <MacroRow label="Protein"       color="#FF6B6B"    consumed={todayProtein} goal={180} />
          <MacroRow label="Carbohydrates" color={COLORS.lime} consumed={todayCarbs}  goal={240} />
          <MacroRow label="Fats"          color={COLORS.amber} consumed={todayFats}  goal={70}  />
          <MacroRow label="Fiber"         color={COLORS.cyan}  consumed={todayFiber} goal={30}  />
          <MacroRow label="Sodium"        color={COLORS.violet} consumed={todaySodium} goal={2300} unit="mg" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Body Stats</div>
            </div>
            {[
              { label: "Weight",  val: bodyLog?.weightKg ? `${bodyLog.weightKg} kg` : "—",  note: "Latest log",          color: COLORS.lime },
              { label: "Avg Cal", val: `${weekly?.summary?.avgCalories || 0} kcal`,          note: "Weekly average",      color: COLORS.amber },
              { label: "Water",   val: `${weekly?.summary?.avgWater || 0} glasses`,           note: "Daily average",       color: COLORS.cyan },
              { label: "Habits",  val: `${doneHabits}/${habits.length}`,                      note: "Completed today",     color: COLORS.violet },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{s.note}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>This Week</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <ProgressRing size={72} stroke={6} value={weekly?.summary?.totalWorkouts || 0} max={6} color={COLORS.lime}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.textPrimary }}>{weekly?.summary?.totalWorkouts || 0}/6</div>
                </ProgressRing>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 8 }}>Workouts</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <ProgressRing size={72} stroke={6} value={doneHabits} max={habits.length || 1} color={COLORS.violet}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.textPrimary }}>{doneHabits}/{habits.length}</div>
                </ProgressRing>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 8 }}>Habits</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Calories</div>
            <span style={{ fontSize: 12, color: COLORS.textSecondary }}>🟩 Consumed</span>
          </div>
          <div className="chart-area">
            {weeklyCalChart.length > 0
              ? <BarChart data={weeklyCalChart} height={140} />
              : <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", paddingTop: 40 }}>No data yet — log some meals!</div>
            }
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weight Progress (7 days)</div>
            {weeklyWeightChart.length >= 2 && (
              <span style={{ fontSize: 12, color: COLORS.lime }}>
                {(weeklyWeightChart[0].weight - weeklyWeightChart[weeklyWeightChart.length - 1].weight).toFixed(1)}kg
              </span>
            )}
          </div>
          <div className="chart-area">
            {weeklyWeightChart.length > 1
              ? <LineChart data={weeklyWeightChart} height={140} />
              : <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center", paddingTop: 40 }}>Log your weight in Profile to see trend</div>
            }
          </div>
        </div>
      </div>

      {/* Habits + Water */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Daily Habits</div>
            <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{doneHabits}/{habits.length} done</span>
          </div>
          {habits.length === 0 ? (
            <div style={{ color: COLORS.textMuted, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
              No habits yet — add some in the Habits section!
            </div>
          ) : habits.map(h => (
            <div key={h.id} className="habit-item" onClick={() => handleToggleHabit(h.id)}>
              <div className={`habit-check ${h.doneToday ? "done" : ""}`}>{h.doneToday ? "✓" : ""}</div>
              <div style={{ fontSize: 18 }}>{h.icon || "✅"}</div>
              <div style={{ flex: 1 }}>
                <div className="habit-label" style={{ textDecoration: h.doneToday ? "line-through" : "none", opacity: h.doneToday ? 0.6 : 1 }}>
                  {h.label}
                </div>
                <div className="habit-streak">🔥 {h.streak} day streak</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Water Intake</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.cyan }}>
              {water}<span style={{ fontSize: 14, fontWeight: 500, color: COLORS.textSecondary }}>/{WATER_GOAL}</span>
            </div>
          </div>
          <div style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 12 }}>Tap a glass to log water</div>
          <div className="water-glasses">
            {Array.from({ length: WATER_GOAL }).map((_, i) => (
              <div
                key={i}
                className={`water-glass ${i < water ? "filled" : ""}`}
                onClick={() => handleLogWater(i)}
              />
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "10px 12px", background: COLORS.cyanDim, borderRadius: 10, fontSize: 13, color: COLORS.cyan }}>
            {water >= WATER_GOAL
              ? "🎉 Daily water goal achieved!"
              : `💧 Drink ${WATER_GOAL - water} more glass${WATER_GOAL - water > 1 ? "es" : ""} to hit your goal!`
            }
          </div>
        </div>
      </div>
    </div>
  );
}