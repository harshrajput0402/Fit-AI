import { useState, useEffect } from "react";
import { COLORS } from "../styles/tokens";
import { getProfile, updateProfile, getLatestBody, logBody } from "../api/user.api";

export default function ProfilePage({ user }) {
  const [editing, setEditing]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  // Profile fields
  const [form, setForm] = useState({
    name: "", age: "", gender: "", activityLevel: "",
    goal: "", targetWeightKg: "", dietaryPref: "", allergies: "", equipment: "",
    maintenanceCals: "", cuttingCals: "", bulkingCals: "",
  });

  // Body measurements
  const [body, setBody] = useState({
    weightKg: "", heightCm: "", bodyFatPct: "", chestCm: "", waistCm: "",
  });

  // ── Load profile & body on mount ──────────
  useEffect(() => {
    const load = async () => {
      try {
        const [profile, bodyLog] = await Promise.all([getProfile(), getLatestBody()]);

        setForm({
          name:           profile.name           || "",
          age:            profile.age             || "",
          gender:         profile.gender          || "",
          activityLevel:  profile.profile?.activityLevel  || "",
          goal:           profile.profile?.goal           || "",
          targetWeightKg: profile.profile?.targetWeightKg || "",
          dietaryPref:    profile.profile?.dietaryPref    || "",
          allergies:      profile.profile?.allergies      || "",
          equipment:      profile.profile?.equipment      || "",
          maintenanceCals:profile.profile?.maintenanceCals|| "",
          cuttingCals:    profile.profile?.cuttingCals    || "",
          bulkingCals:    profile.profile?.bulkingCals    || "",
        });

        if (bodyLog) {
          setBody({
            weightKg:   bodyLog.weightKg   || "",
            heightCm:   profile.heightCm   || "",
            bodyFatPct: bodyLog.bodyFatPct || "",
            chestCm:    bodyLog.chestCm    || "",
            waistCm:    bodyLog.waistCm    || "",
          });
        } else {
          setBody(b => ({ ...b, heightCm: profile.heightCm || "" }));
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Save changes ──────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({
        name:           form.name           || undefined,
        age:            form.age            ? Number(form.age)            : undefined,
        gender:         form.gender         || undefined,
        heightCm:       body.heightCm       ? Number(body.heightCm)       : undefined,
        goal:           form.goal           || undefined,
        activityLevel:  form.activityLevel  || undefined,
        targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
        dietaryPref:    form.dietaryPref    || undefined,
        allergies:      form.allergies      || undefined,
        equipment:      form.equipment      || undefined,
        maintenanceCals:form.maintenanceCals? Number(form.maintenanceCals): undefined,
        cuttingCals:    form.cuttingCals    ? Number(form.cuttingCals)    : undefined,
        bulkingCals:    form.bulkingCals    ? Number(form.bulkingCals)    : undefined,
      });

      // Log body measurements if weight entered
      if (body.weightKg) {
        await logBody({
          weightKg:   Number(body.weightKg),
          bodyFatPct: body.bodyFatPct ? Number(body.bodyFatPct) : undefined,
          chestCm:    body.chestCm    ? Number(body.chestCm)    : undefined,
          waistCm:    body.waistCm    ? Number(body.waistCm)    : undefined,
        });
      }

      setSuccess("Profile saved successfully!");
      setEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = form.name?.charAt(0).toUpperCase() || "U";

  // ── BMI calculation ───────────────────────
  const bmi = body.weightKg && body.heightCm
    ? (Number(body.weightKg) / Math.pow(Number(body.heightCm) / 100, 2)).toFixed(1)
    : "—";

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.textSecondary }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Profile</div>
        <button
          className="btn btn-primary"
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={saving}
        >
          {saving ? "Saving..." : editing ? "💾 Save Changes" : "✏️ Edit Profile"}
        </button>
      </div>

      {/* Success / Error banners */}
      {success && (
        <div style={{ background: "rgba(163,230,53,0.1)", border: `1px solid ${COLORS.lime}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: COLORS.lime }}>
          ✅ {success}
        </div>
      )}
      {error && (
        <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#ff5050" }}>
          ⚠️ {error}
        </div>
      )}

      <div className="grid-12">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Avatar card */}
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.lime})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>
              {avatarLetter}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.textPrimary }}>{form.name || user?.name}</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, margin: "4px 0 12px" }}>
              {form.goal?.replace("_", " ") || "Goal not set"} · {form.activityLevel?.replace("_", " ") || "Level not set"}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              <span className="badge badge-success">📧 {user?.email}</span>
            </div>
          </div>

          {/* Body measurements */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Body Measurements</div>
            {[
              { label: "Height",   key: "heightCm",   unit: "cm",  src: "body" },
              { label: "Weight",   key: "weightKg",   unit: "kg",  src: "body" },
              { label: "BMI",      key: null,          unit: "",    val: bmi },
              { label: "Body Fat", key: "bodyFatPct",  unit: "%",   src: "body" },
              { label: "Chest",    key: "chestCm",     unit: "cm",  src: "body" },
              { label: "Waist",    key: "waistCm",     unit: "cm",  src: "body" },
            ].map(m => (
              <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{m.label}</span>
                {editing && m.key ? (
                  <input
                    className="form-input"
                    style={{ width: 100, padding: "4px 8px", fontSize: 13, textAlign: "right" }}
                    value={body[m.key]}
                    onChange={e => setBody({ ...body, [m.key]: e.target.value })}
                    placeholder={m.unit}
                  />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>
                    {m.val ?? (body[m.key] ? `${body[m.key]} ${m.unit}` : "—")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Personal info */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Personal Information</div>
            <div className="grid-2">
              {[
                { label: "Full Name",       key: "name",          type: "text" },
                { label: "Age",             key: "age",           type: "number" },
                { label: "Gender",          key: "gender",        type: "text" },
                { label: "Activity Level",  key: "activityLevel", type: "text" },
              ].map(f => (
                <div key={f.label} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-input"
                    type={f.type}
                    value={form[f.key]}
                    readOnly={!editing}
                    style={{ opacity: editing ? 1 : 0.8 }}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={editing ? `Enter ${f.label.toLowerCase()}` : "—"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fitness goals */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Fitness Goals & Preferences</div>
            <div className="grid-2">
              {[
                { label: "Primary Goal",       key: "goal" },
                { label: "Target Weight (kg)", key: "targetWeightKg" },
                { label: "Dietary Preference", key: "dietaryPref" },
                { label: "Allergies",          key: "allergies" },
                { label: "Equipment",          key: "equipment" },
              ].map(f => (
                <div key={f.label} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-input"
                    value={form[f.key]}
                    readOnly={!editing}
                    style={{ opacity: editing ? 1 : 0.8 }}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={editing ? `Enter ${f.label.toLowerCase()}` : "—"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Calorie targets */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Calorie Targets</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "Maintenance", key: "maintenanceCals", color: COLORS.amber },
                { label: "Cutting (–500)", key: "cuttingCals",  color: COLORS.lime },
                { label: "Bulking (+500)", key: "bulkingCals",  color: COLORS.violet },
              ].map(t => (
                <div key={t.label} style={{ background: COLORS.surface, borderRadius: 12, padding: 16, textAlign: "center", border: `1px solid ${COLORS.border}` }}>
                  {editing ? (
                    <input
                      className="form-input"
                      type="number"
                      value={form[t.key]}
                      onChange={e => setForm({ ...form, [t.key]: e.target.value })}
                      style={{ textAlign: "center", fontSize: 18, fontWeight: 800, color: t.color, background: "transparent", border: "none", borderBottom: `1px solid ${t.color}`, borderRadius: 0, padding: "4px 0", width: "100%" }}
                      placeholder="0"
                    />
                  ) : (
                    <div style={{ fontSize: 22, fontWeight: 800, color: t.color }}>
                      {form[t.key] ? Number(form[t.key]).toLocaleString() : "—"}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 4 }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>kcal / day</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}