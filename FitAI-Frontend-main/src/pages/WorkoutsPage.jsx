import { useState, useEffect } from "react";
import { COLORS } from "../styles/tokens";
import { getWorkouts, createWorkout, addExercise, completeWorkout, deleteWorkout } from "../api/workout.api";

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];

const EXERCISE_LIBRARY = [
  { name: "Bench Press",   muscle: "Chest",     icon: "🫁" },
  { name: "Deadlift",      muscle: "Full Body",  icon: "🏋️" },
  { name: "Squat",         muscle: "Legs",       icon: "🦵" },
  { name: "Pull-Up",       muscle: "Back",       icon: "💪" },
  { name: "OHP",           muscle: "Shoulders",  icon: "🏔️" },
  { name: "Barbell Row",   muscle: "Back",       icon: "💪" },
];

const emptyExerciseForm = {
  name: "", sets: "", reps: "", weightKg: "", muscleGroup: "Chest", notes: "",
};

export default function WorkoutsPage() {
  const [tab, setTab]               = useState("today");
  const [workouts, setWorkouts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Modal state
  const [showWorkoutModal, setShowWorkoutModal] = useState(false); // create workout
  const [showExerciseModal, setShowExerciseModal] = useState(false); // add exercise
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  // Forms
  const [workoutName, setWorkoutName]   = useState("");
  const [exerciseForm, setExerciseForm] = useState(emptyExerciseForm);
  const [saving, setSaving]             = useState(false);

  // ── Load workouts ──────────────────────────
  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  // ── Today's workout (completed today) ─────
  const today      = new Date(); today.setHours(0, 0, 0, 0);
  const todayWorkouts = workouts.filter(w => {
    const d = new Date(w.completedAt || w.createdAt);
    return d >= today;
  });

  const historyWorkouts = workouts.filter(w => {
    const d = new Date(w.completedAt || w.createdAt);
    return d < today;
  });

  // ── Stats for today ────────────────────────
  const todaySets = todayWorkouts.reduce((s, w) =>
    s + (w.exercises || []).reduce((es, e) => es + (e.sets || 0), 0), 0
  );
  const todayCalsBurned = todayWorkouts.reduce((s, w) =>
    s + (w.exercises || []).reduce((es, e) => es + (e.caloriesBurned || 0), 0), 0
  );
  const todayDuration = todayWorkouts.reduce((s, w) => s + (w.durationMin || 0), 0);

  // ── Create workout ─────────────────────────
  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) return;
    setSaving(true);
    try {
      const newWorkout = await createWorkout({ name: workoutName });
      setWorkouts(prev => [{ ...newWorkout, exercises: [] }, ...prev]);
      setSelectedWorkoutId(newWorkout.id);
      setWorkoutName("");
      setShowWorkoutModal(false);
      setShowExerciseModal(true); // immediately open add exercise
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Add exercise to workout ────────────────
  const handleAddExercise = async () => {
    if (!exerciseForm.name || !exerciseForm.sets || !exerciseForm.reps) {
      setError("Name, sets and reps are required");
      return;
    }
    setSaving(true);
    try {
      await addExercise(selectedWorkoutId, {
        name:        exerciseForm.name,
        muscleGroup: exerciseForm.muscleGroup,
        sets:        Number(exerciseForm.sets),
        reps:        exerciseForm.reps,
        weightKg:    exerciseForm.weightKg ? Number(exerciseForm.weightKg) : undefined,
        notes:       exerciseForm.notes || undefined,
      });
      await loadWorkouts(); // refresh to show new exercise
      setExerciseForm(emptyExerciseForm);
      setShowExerciseModal(false);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Complete workout ───────────────────────
  const handleComplete = async (workoutId, durationMin) => {
    try {
      await completeWorkout(workoutId, durationMin);
      await loadWorkouts();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Delete workout ─────────────────────────
  const handleDelete = async (workoutId) => {
    if (!confirm("Delete this workout?")) return;
    try {
      await deleteWorkout(workoutId);
      setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Open add exercise for existing workout ─
  const openAddExercise = (workoutId) => {
    setSelectedWorkoutId(workoutId);
    setExerciseForm(emptyExerciseForm);
    setShowExerciseModal(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Workout Tracker</div>
          <div className="page-subtitle">Log sets, track progress, crush goals</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowWorkoutModal(true)}>
          + New Workout
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#ff5050" }}>
          ⚠️ {error}
        </div>
      )}

      <div className="tab-bar">
        {["today", "history", "plans", "exercises"].map(t => (
          <button key={t} className={`tab-item ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* TODAY TAB */}
      {tab === "today" && (
        <>
          <div className="grid-3 mb-6">
            {[
              { label: "Total Sets",      val: todaySets || "0",                    icon: "📋", color: COLORS.lime },
              { label: "Calories Burned", val: todayCalsBurned || "0",              icon: "🔥", color: COLORS.rose },
              { label: "Duration",        val: todayDuration ? `${todayDuration}m` : "0m", icon: "⏱️", color: COLORS.cyan },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ color: COLORS.textSecondary, textAlign: "center", padding: 40 }}>Loading workouts...</div>
          ) : todayWorkouts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏋️</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 8 }}>No workout logged today</div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 }}>Start a new session to track your exercises</div>
              <button className="btn btn-primary" onClick={() => setShowWorkoutModal(true)}>+ Start Workout</button>
            </div>
          ) : (
            todayWorkouts.map(workout => (
              <div key={workout.id} className="card mb-4">
                <div className="card-header">
                  <div>
                    <div className="card-title">{workout.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                      {workout.exercises?.length || 0} exercises
                      {workout.durationMin ? ` · ${workout.durationMin} min` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {workout.completedAt
                      ? <span className="badge badge-success">✅ Completed</span>
                      : <button className="btn btn-primary btn-sm" onClick={() => handleComplete(workout.id, 60)}>Mark Complete</button>
                    }
                    <button className="btn btn-ghost btn-sm" onClick={() => openAddExercise(workout.id)}>+ Exercise</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(workout.id)}>🗑</button>
                  </div>
                </div>

                {workout.exercises?.length === 0 ? (
                  <div style={{ color: COLORS.textMuted, fontSize: 13, padding: "12px 0" }}>No exercises yet — add some!</div>
                ) : (
                  workout.exercises.map((ex, i) => (
                    <div key={i} className="workout-item">
                      <div className="workout-muscle">💪</div>
                      <div className="workout-details">
                        <div className="workout-name">{ex.name}</div>
                        <div className="workout-meta">{ex.muscleGroup}{ex.notes ? ` · ${ex.notes}` : ""}</div>
                      </div>
                      <div className="workout-stats">
                        {[["Sets", ex.sets], ["Reps", ex.reps], ["Weight", ex.weightKg ? `${ex.weightKg}kg` : "—"]].map(([key, val]) => (
                          <div key={key}>
                            <div className="workout-stat-val">{val}</div>
                            <div className="workout-stat-key">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))
          )}
        </>
      )}

      {/* HISTORY TAB */}
      {tab === "history" && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Workout History</div>
          {historyWorkouts.length === 0 ? (
            <div style={{ color: COLORS.textMuted, fontSize: 13, padding: "20px 0", textAlign: "center" }}>No past workouts yet</div>
          ) : (
            historyWorkouts.map((w, i) => (
              <div key={w.id} className="timeline-item">
                <div className="timeline-dot">{w.completedAt ? "💪" : "📋"}</div>
                <div className="timeline-content">
                  <div className="timeline-time">
                    {new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="timeline-title">{w.name}</div>
                  <div className="timeline-body">
                    {w.exercises?.length || 0} exercises
                    {w.durationMin ? ` · ${w.durationMin} min` : ""}
                    {w.completedAt ? " · ✅ Completed" : " · Not completed"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PLANS TAB */}
      {tab === "plans" && (
        <div className="plan-card">
          <div className="plan-card-header">
            <div>
              <div className="plan-card-title">Push Pull Legs (PPL) – 6 Day Split</div>
              <div className="plan-card-meta">AI Generated · Hypertrophy Focus · Intermediate</div>
            </div>
            <span className="badge badge-violet">Active</span>
          </div>
          {[
            "Monday · Push (Chest, Shoulders, Triceps)",
            "Tuesday · Pull (Back, Biceps)",
            "Wednesday · Legs (Quads, Hamstrings, Calves)",
            "Thursday · Push (Volume)",
            "Friday · Pull (Volume)",
            "Saturday · Legs (Volume)",
            "Sunday · Rest & Recovery",
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 6 ? COLORS.border : COLORS.limeDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 6 ? COLORS.textMuted : COLORS.lime }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: i === 6 ? COLORS.textMuted : COLORS.textPrimary }}>{d}</div>
            </div>
          ))}
        </div>
      )}

      {/* EXERCISES TAB */}
      {tab === "exercises" && (
        <div className="grid-3">
          {EXERCISE_LIBRARY.map(ex => (
            <div key={ex.name} className="card" style={{ cursor: "pointer" }}
              onClick={() => { setExerciseForm({ ...emptyExerciseForm, name: ex.name, muscleGroup: ex.muscle }); setShowExerciseModal(true); }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{ex.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{ex.name}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{ex.muscle}</div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE WORKOUT MODAL */}
      {showWorkoutModal && (
        <div className="modal-backdrop" onClick={() => setShowWorkoutModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Start New Workout</div>
              <button className="close-btn" onClick={() => setShowWorkoutModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Session Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Chest Day, Upper Body..."
                  value={workoutName}
                  onChange={e => setWorkoutName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreateWorkout()}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowWorkoutModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateWorkout} disabled={saving}>
                {saving ? "Creating..." : "Create & Add Exercises →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXERCISE MODAL */}
      {showExerciseModal && (
        <div className="modal-backdrop" onClick={() => setShowExerciseModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Exercise</div>
              <button className="close-btn" onClick={() => setShowExerciseModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div style={{ color: "#ff5050", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}
              <div className="form-group">
                <label className="form-label">Exercise Name</label>
                <input className="form-input" placeholder="e.g. Bench Press"
                  value={exerciseForm.name}
                  onChange={e => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                />
              </div>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Sets</label>
                  <input className="form-input" type="number" placeholder="4"
                    value={exerciseForm.sets}
                    onChange={e => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reps</label>
                  <input className="form-input" placeholder="8-10"
                    value={exerciseForm.reps}
                    onChange={e => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input className="form-input" type="number" placeholder="80"
                    value={exerciseForm.weightKg}
                    onChange={e => setExerciseForm({ ...exerciseForm, weightKg: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Muscle Group</label>
                <select className="form-input" value={exerciseForm.muscleGroup}
                  onChange={e => setExerciseForm({ ...exerciseForm, muscleGroup: e.target.value })}
                >
                  {MUSCLE_GROUPS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <input className="form-input" placeholder="Optional notes..."
                  value={exerciseForm.notes}
                  onChange={e => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowExerciseModal(false)}>Cancel</button>
              <button className="btn btn-secondary" onClick={() => { handleAddExercise(); setExerciseForm(emptyExerciseForm); }}>
                + Add Another
              </button>
              <button className="btn btn-primary" onClick={handleAddExercise} disabled={saving}>
                {saving ? "Saving..." : "Save Exercise"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}