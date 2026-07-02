import { COLORS } from "../styles/tokens";

// ── Progress Ring ──────────────────────────────────────────
export function ProgressRing({ size = 80, stroke = 6, value, max, color, children }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min((value / max) * 100, 100);
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

// ── Bar Chart ──────────────────────────────────────────────
export function BarChart({ data, height = 140 }) {
  const maxVal = Math.max(...data.flatMap(d => [d.consumed, d.burned]));
  return (
    <svg viewBox={`0 0 400 ${height}`} className="custom-chart" style={{ height }}>
      {data.map((d, i) => {
        const x = i * (400 / data.length) + 4;
        const barW = (400 / data.length) - 8;
        const ch = (d.consumed / maxVal) * (height - 30);
        const bh = (d.burned / maxVal) * (height - 30);
        return (
          <g key={d.day}>
            <rect x={x} y={height - 20 - ch} width={barW * 0.48} height={ch} rx="3" fill={COLORS.lime} opacity="0.8" />
            <rect x={x + barW * 0.52} y={height - 20 - bh} width={barW * 0.48} height={bh} rx="3" fill={COLORS.violet} opacity="0.8" />
            <text x={x + barW / 2} y={height - 4} textAnchor="middle" fill={COLORS.textMuted} fontSize="10">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Line Chart ─────────────────────────────────────────────
export function LineChart({ data, height = 100 }) {
  const vals = data.map(d => d.weight);
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * 380 + 10;
    const y = height - 20 - ((v - min) / (max - min)) * (height - 30);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 400 ${height}`} className="custom-chart" style={{ height }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.lime} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.lime} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts.join(" ")} fill="none" stroke={COLORS.lime} strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (vals.length - 1)) * 380 + 10;
        const y = height - 20 - ((vals[i] - min) / (max - min)) * (height - 30);
        return (
          <g key={d.day}>
            <circle cx={x} cy={y} r="4" fill={COLORS.lime} />
            <text x={x} y={height - 4} textAnchor="middle" fill={COLORS.textMuted} fontSize="9">{d.day}</text>
            <text x={x} y={y - 8} textAnchor="middle" fill={COLORS.lime} fontSize="9">{vals[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Macro Row ──────────────────────────────────────────────
export function MacroRow({ label, color, consumed, goal, unit = "g" }) {
  const pct = Math.min((consumed / goal) * 100, 100);
  return (
    <div className="macro-row">
      <div className="macro-name">
        <div className="macro-dot" style={{ background: color }} />
        {label}
      </div>
      <div className="macro-bar-wrap">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%`, "--fill-color": color }} />
        </div>
      </div>
      <div className="macro-values">{consumed}{unit} / {goal}{unit}</div>
    </div>
  );
}
