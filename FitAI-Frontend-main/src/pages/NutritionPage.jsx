import { useState, useEffect } from "react";
import { COLORS } from "../styles/tokens";
import { MacroRow } from "../components/Charts";
import { getTodayMeals, createMeal, deleteMeal } from "../api/nutrition.api";

const MEAL_TYPES = [
  { type: "breakfast", label: "Breakfast", icon: "🌅" },
  { type: "lunch",     label: "Lunch",     icon: "☀️" },
  { type: "dinner",    label: "Dinner",    icon: "🌙" },
  { type: "snack",     label: "Snack",     icon: "🍎" },
];

const emptyFoodItem = {
  name: "", servingG: "", calories: "", proteinG: "", carbsG: "", fatsG: "", fiberG: "", sodiumMg: "",
};

const emptyMealForm = {
  type: "breakfast",
  note: "",
  foodItems: [{ ...emptyFoodItem }],
};

export default function NutritionPage() {
  const [meals, setMeals]       = useState([]);
  const [totals, setTotals]     = useState({ calories: 0, proteinG: 0, carbsG: 0, fatsG: 0, fiberG: 0, sodiumMg: 0 });
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mealForm, setMealForm] = useState(emptyMealForm);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  // ── Load today's meals ─────────────────────
  useEffect(() => { loadMeals(); }, []);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const data = await getTodayMeals();
      setMeals(data.meals || []);
      setTotals(data.totals || {});
    } catch (err) {
      setError("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  // ── Group meals by type ────────────────────
  const mealsByType = MEAL_TYPES.reduce((acc, m) => {
    acc[m.type] = meals.filter(meal => meal.type === m.type);
    return acc;
  }, {});

  // ── Add / remove food item rows in modal ───
  const addFoodRow = () =>
    setMealForm(f => ({ ...f, foodItems: [...f.foodItems, { ...emptyFoodItem }] }));

  const removeFoodRow = (i) =>
    setMealForm(f => ({ ...f, foodItems: f.foodItems.filter((_, idx) => idx !== i) }));

  const updateFoodRow = (i, field, val) =>
    setMealForm(f => {
      const items = [...f.foodItems];
      items[i] = { ...items[i], [field]: val };
      return { ...f, foodItems: items };
    });

  // ── Save meal ──────────────────────────────
  const handleSaveMeal = async () => {
    const validItems = mealForm.foodItems.filter(f => f.name && f.calories);
    if (validItems.length === 0) {
      setError("Add at least one food item with name and calories");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createMeal({
        type: mealForm.type,
        note: mealForm.note || undefined,
        foodItems: validItems.map(f => ({
          name:      f.name,
          servingG:  f.servingG  ? Number(f.servingG)  : 100,
          calories:  Number(f.calories),
          proteinG:  f.proteinG  ? Number(f.proteinG)  : 0,
          carbsG:    f.carbsG    ? Number(f.carbsG)    : 0,
          fatsG:     f.fatsG     ? Number(f.fatsG)     : 0,
          fiberG:    f.fiberG    ? Number(f.fiberG)    : undefined,
          sodiumMg:  f.sodiumMg  ? Number(f.sodiumMg)  : undefined,
        })),
      });
      await loadMeals();
      setMealForm(emptyMealForm);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete meal ────────────────────────────
  const handleDeleteMeal = async (mealId) => {
    if (!confirm("Delete this meal?")) return;
    try {
      await deleteMeal(mealId);
      await loadMeals();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Pie chart from real totals ─────────────
  const proteinCals = (totals.proteinG || 0) * 4;
  const carbsCals   = (totals.carbsG   || 0) * 4;
  const fatsCals    = (totals.fatsG    || 0) * 9;
  const totalMacroCals = proteinCals + carbsCals + fatsCals || 1;

  const pieSlices = [
    { val: proteinCals, color: "#FF6B6B", label: "Protein", pct: Math.round((proteinCals / totalMacroCals) * 100) },
    { val: carbsCals,   color: COLORS.lime, label: "Carbs",  pct: Math.round((carbsCals   / totalMacroCals) * 100) },
    { val: fatsCals,    color: COLORS.amber, label: "Fats",  pct: Math.round((fatsCals    / totalMacroCals) * 100) },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Nutrition Tracker</div>
          <div className="page-subtitle">Track meals, macros & micronutrients</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setError(""); }}>
          + Log Meal
        </button>
      </div>

      {error && !showModal && (
        <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#ff5050" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Macro stat cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Calories", val: totals.calories || 0,             goal: 2429,  unit: "",   color: COLORS.lime },
          { label: "Protein",  val: totals.proteinG || 0,             goal: 180,   unit: "g",  color: "#FF6B6B" },
          { label: "Carbs",    val: Math.round(totals.carbsG || 0),   goal: 240,   unit: "g",  color: COLORS.amber },
          { label: "Fats",     val: Math.round(totals.fatsG || 0),    goal: 70,    unit: "g",  color: COLORS.violet },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}{s.unit}</div>
            <div style={{ fontSize: 11, color: COLORS.textSecondary }}>of {s.goal}{s.unit}</div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-21">
        {/* Meal log */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Meal Log</div>
            <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
              Total: {totals.calories || 0} kcal
            </span>
          </div>

          {loading ? (
            <div style={{ color: COLORS.textSecondary, padding: "20px 0", textAlign: "center" }}>Loading meals...</div>
          ) : meals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🍽️</div>
              <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 }}>No meals logged today</div>
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Log First Meal</button>
            </div>
          ) : (
            MEAL_TYPES.map(({ type, label, icon }) => {
              const typeMeals = mealsByType[type] || [];
              if (typeMeals.length === 0) return null;
              const typeCals = typeMeals.reduce((s, m) =>
                s + m.foodItems.reduce((fs, f) => fs + (f.calories || 0), 0), 0
              );
              return (
                <div key={type} className="meal-section">
                  <div className="meal-section-header">
                    <div className="meal-section-title">{icon} {label}</div>
                    <div className="meal-section-cals">{typeCals} kcal</div>
                  </div>
                  {typeMeals.map(meal => (
                    <div key={meal.id}>
                      {meal.foodItems.map((item, i) => (
                        <div key={i} className="food-item">
                          <div>
                            <div className="food-name">{item.name}</div>
                            <div className="food-meta">
                              {item.servingG}g · P:{item.proteinG}g C:{item.carbsG}g F:{item.fatsG}g
                            </div>
                          </div>
                          <div className="food-cals">{item.calories}</div>
                        </div>
                      ))}
                      <button
                        className="btn btn-danger btn-xs"
                        style={{ marginTop: 6, marginBottom: 8 }}
                        onClick={() => handleDeleteMeal(meal.id)}
                      >
                        🗑 Delete meal
                      </button>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-xs" style={{ marginTop: 4 }}
                    onClick={() => { setMealForm({ ...emptyMealForm, type }); setShowModal(true); }}
                  >
                    + Add to {label.toLowerCase()}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Micronutrients */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Micronutrients</div>
            <MacroRow label="Fiber"  color={COLORS.cyan}   consumed={Math.round(totals.fiberG   || 0)} goal={30}   unit="g"  />
            <MacroRow label="Sodium" color={COLORS.violet}  consumed={Math.round(totals.sodiumMg || 0)} goal={2300} unit="mg" />
            <MacroRow label="Protein" color="#FF6B6B"       consumed={Math.round(totals.proteinG || 0)} goal={180}  unit="g"  />
            <MacroRow label="Carbs"  color={COLORS.lime}    consumed={Math.round(totals.carbsG   || 0)} goal={240}  unit="g"  />
            <MacroRow label="Fats"   color={COLORS.amber}   consumed={Math.round(totals.fatsG    || 0)} goal={70}   unit="g"  />
          </div>

          {/* Calorie pie chart */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Calorie Breakdown</div>
            <div style={{ textAlign: "center" }}>
              <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
                {(() => {
                  let offset = 0;
                  return pieSlices.map((s, i) => {
                    const pct = s.val / totalMacroCals;
                    const el = (
                      <circle key={i} cx="60" cy="60" r="45" fill="none" stroke={s.color}
                        strokeWidth="24"
                        strokeDasharray={`${pct * 282.6} ${282.6 - pct * 282.6}`}
                        strokeDashoffset={-offset * 282.6}
                        transform="rotate(-90 60 60)" opacity="0.85" />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
                <text x="60" y="56" textAnchor="middle" fill={COLORS.textPrimary} fontSize="14" fontWeight="800">
                  {totals.calories || 0}
                </text>
                <text x="60" y="70" textAnchor="middle" fill={COLORS.textSecondary} fontSize="9">kcal</text>
              </svg>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
                {pieSlices.map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, margin: "0 auto 4px" }} />
                    <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{s.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{s.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOG MEAL MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Log Meal</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div style={{ color: "#ff5050", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}

              {/* Meal type selector */}
              <div className="form-group">
                <label className="form-label">Meal Type</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {MEAL_TYPES.map(m => (
                    <button key={m.type}
                      className={`btn ${mealForm.type === m.type ? "btn-primary" : "btn-ghost"} btn-sm`}
                      onClick={() => setMealForm(f => ({ ...f, type: m.type }))}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food items */}
              <div style={{ marginBottom: 12 }}>
                <label className="form-label">Food Items</label>
                {mealForm.foodItems.map((item, i) => (
                  <div key={i} style={{ background: COLORS.surface, borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input className="form-input" placeholder="Food name *"
                        value={item.name} style={{ flex: 2 }}
                        onChange={e => updateFoodRow(i, "name", e.target.value)}
                      />
                      <input className="form-input" type="number" placeholder="Serving (g)"
                        value={item.servingG} style={{ flex: 1 }}
                        onChange={e => updateFoodRow(i, "servingG", e.target.value)}
                      />
                      <input className="form-input" type="number" placeholder="Calories *"
                        value={item.calories} style={{ flex: 1 }}
                        onChange={e => updateFoodRow(i, "calories", e.target.value)}
                      />
                      {mealForm.foodItems.length > 1 && (
                        <button className="btn btn-danger btn-xs" onClick={() => removeFoodRow(i)}>✕</button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["proteinG", "Protein (g)"], ["carbsG", "Carbs (g)"], ["fatsG", "Fats (g)"], ["sodiumMg", "Sodium (mg)"]].map(([field, ph]) => (
                        <input key={field} className="form-input" type="number" placeholder={ph}
                          value={item[field]}
                          onChange={e => updateFoodRow(i, field, e.target.value)}
                          style={{ flex: 1 }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={addFoodRow}>+ Add another food</button>
              </div>

              <div className="form-group">
                <label className="form-label">Note (optional)</label>
                <input className="form-input" placeholder="e.g. Post-workout meal"
                  value={mealForm.note}
                  onChange={e => setMealForm(f => ({ ...f, note: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveMeal} disabled={saving}>
                {saving ? "Saving..." : "Save Meal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}