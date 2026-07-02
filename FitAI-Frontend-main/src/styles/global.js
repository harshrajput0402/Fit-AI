import { COLORS } from "./tokens";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: 'Inter', sans-serif;
    background: ${COLORS.obsidian};
    color: ${COLORS.textPrimary};
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${COLORS.lime}44; }

  .app-shell { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: 240px; min-height: 100vh;
    background: ${COLORS.surface};
    border-right: 1px solid ${COLORS.border};
    display: flex; flex-direction: column;
    position: fixed; left: 0; top: 0; bottom: 0;
    z-index: 100; transition: transform 0.3s ease;
  }
  .sidebar-logo {
    padding: 24px 20px;
    display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid ${COLORS.border};
  }
  .logo-icon {
    width: 36px; height: 36px;
    background: ${COLORS.lime}; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .logo-text { font-size: 18px; font-weight: 800; color: ${COLORS.textPrimary}; letter-spacing: -0.5px; }
  .logo-text span { color: ${COLORS.lime}; }
  .sidebar-nav {
    flex: 1; padding: 16px 12px;
    display: flex; flex-direction: column; gap: 4px; overflow-y: auto;
  }
  .nav-section-label {
    font-size: 10px; font-weight: 600; color: ${COLORS.textMuted};
    letter-spacing: 1.5px; text-transform: uppercase; padding: 12px 8px 6px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; cursor: pointer;
    transition: all 0.15s ease; color: ${COLORS.textSecondary};
    font-size: 13.5px; font-weight: 500;
    border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: ${COLORS.card}; color: ${COLORS.textPrimary}; }
  .nav-item.active { background: ${COLORS.limeDim}; color: ${COLORS.lime}; }
  .nav-item .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-user {
    padding: 16px; border-top: 1px solid ${COLORS.border};
    display: flex; align-items: center; gap: 10px; cursor: pointer;
  }
  .user-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, ${COLORS.violet}, ${COLORS.lime});
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .user-info { flex: 1; overflow: hidden; }
  .user-name { font-size: 13px; font-weight: 600; color: ${COLORS.textPrimary}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-goal { font-size: 11px; color: ${COLORS.textSecondary}; }

  /* ── Sidebar overlay (mobile) ── */
  .sidebar-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.6); z-index: 99;
    backdrop-filter: blur(2px);
  }
  .sidebar-overlay.open { display: block; }

  /* ── Mobile menu button ── */
  .menu-btn {
    display: none; width: 36px; height: 36px; border-radius: 10px;
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    align-items: center; justify-content: center;
    cursor: pointer; font-size: 18px; color: ${COLORS.textSecondary};
  }

  /* ── Sidebar close button (mobile) ── */
  .sidebar-close {
    display: none; position: absolute; top: 16px; right: 16px;
    width: 32px; height: 32px; border-radius: 8px;
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; color: ${COLORS.textSecondary};
  }

  /* ── Main layout ── */
  .main { margin-left: 240px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
  .topbar {
    height: 64px; background: ${COLORS.surface};
    border-bottom: 1px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; position: sticky; top: 0; z-index: 50;
  }
  .topbar-title { font-size: 16px; font-weight: 700; color: ${COLORS.textPrimary}; }
  .topbar-actions { display: flex; align-items: center; gap: 12px; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; color: ${COLORS.textSecondary};
  }
  .icon-btn:hover { border-color: ${COLORS.lime}55; color: ${COLORS.lime}; }
  .page { flex: 1; padding: 28px; overflow-y: auto; }

  /* ── Cards ── */
  .card {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 16px; padding: 20px; transition: border-color 0.15s;
  }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
  .card-title { font-size: 13px; font-weight: 600; color: ${COLORS.textSecondary}; text-transform: uppercase; letter-spacing: 0.8px; }

  /* ── Stat cards ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 16px; padding: 20px;
    position: relative; overflow: hidden; transition: all 0.2s; cursor: default;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--accent, ${COLORS.lime});
    border-radius: 2px 2px 0 0; opacity: 0.7;
  }
  .stat-card:hover { border-color: var(--accent, ${COLORS.lime})44; transform: translateY(-1px); }
  .stat-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: var(--accent-dim, ${COLORS.limeDim});
    display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 12px;
  }
  .stat-value {
    font-size: 28px; font-weight: 800; color: ${COLORS.textPrimary};
    letter-spacing: -1px; line-height: 1; margin-bottom: 4px; font-variant-numeric: tabular-nums;
  }
  .stat-value span { font-size: 14px; font-weight: 500; color: ${COLORS.textSecondary}; letter-spacing: 0; }
  .stat-label { font-size: 12px; color: ${COLORS.textSecondary}; font-weight: 500; }
  .stat-delta {
    font-size: 11px; font-weight: 600; padding: 2px 6px;
    border-radius: 6px; margin-top: 8px; display: inline-block;
  }
  .stat-delta.up { background: #00FF8822; color: #00FF88; }
  .stat-delta.down { background: ${COLORS.roseDim}; color: ${COLORS.rose}; }
  .stat-delta.neutral { background: ${COLORS.amberDim}; color: ${COLORS.amber}; }

  /* ── Progress ring ── */
  .ring-container { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  .ring-label { position: absolute; text-align: center; }

  /* ── Grid helpers ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-12 { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }
  .grid-21 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

  /* ── Buttons ── */
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap; }
  .btn-primary { background: ${COLORS.lime}; color: ${COLORS.obsidian}; }
  .btn-primary:hover { background: ${COLORS.limeHover}; transform: translateY(-1px); }
  .btn-secondary { background: ${COLORS.card}; color: ${COLORS.textPrimary}; border: 1px solid ${COLORS.border}; }
  .btn-secondary:hover { border-color: ${COLORS.lime}55; color: ${COLORS.lime}; }
  .btn-ghost { background: transparent; color: ${COLORS.textSecondary}; border: 1px solid ${COLORS.border}; }
  .btn-ghost:hover { background: ${COLORS.card}; color: ${COLORS.textPrimary}; }
  .btn-danger { background: ${COLORS.roseDim}; color: ${COLORS.rose}; border: 1px solid ${COLORS.rose}33; }
  .btn-danger:hover { background: ${COLORS.rose}; color: white; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .btn-xs { padding: 4px 8px; font-size: 11px; border-radius: 6px; }

  /* ── Form inputs ── */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: ${COLORS.textSecondary}; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { width: 100%; background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 10px; padding: 10px 14px; font-size: 14px; color: ${COLORS.textPrimary}; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s; }
  .form-input:focus { border-color: ${COLORS.lime}; }
  .form-input::placeholder { color: ${COLORS.textMuted}; }
  select.form-input option { background: ${COLORS.surface}; }

  /* ── Progress bars ── */
  .progress-bar { height: 6px; background: ${COLORS.border}; border-radius: 3px; overflow: hidden; }
  .progress-fill {
    height: 100%; border-radius: 3px; background: var(--fill-color, ${COLORS.lime});
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;
  }
  .progress-fill::after {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }

  /* ── Macros ── */
  .macro-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid ${COLORS.border}; }
  .macro-row:last-child { border-bottom: none; }
  .macro-name { font-size: 13px; font-weight: 500; color: ${COLORS.textPrimary}; display: flex; align-items: center; gap: 8px; }
  .macro-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .macro-bar-wrap { flex: 1; margin: 0 16px; }
  .macro-values { font-size: 12px; color: ${COLORS.textSecondary}; font-variant-numeric: tabular-nums; text-align: right; min-width: 70px; }

  /* ── Workout items ── */
  .workout-item { display: flex; align-items: center; gap: 14px; padding: 14px; background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 12px; margin-bottom: 10px; transition: all 0.15s; cursor: pointer; }
  .workout-item:hover { border-color: ${COLORS.lime}44; transform: translateX(2px); }
  .workout-muscle { width: 42px; height: 42px; border-radius: 10px; background: ${COLORS.violetDim}; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .workout-details { flex: 1; min-width: 0; }
  .workout-name { font-size: 14px; font-weight: 600; color: ${COLORS.textPrimary}; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .workout-meta { font-size: 12px; color: ${COLORS.textSecondary}; }
  .workout-stats { display: flex; gap: 12px; text-align: center; flex-shrink: 0; }
  .workout-stat-val { font-size: 14px; font-weight: 700; color: ${COLORS.lime}; }
  .workout-stat-key { font-size: 10px; color: ${COLORS.textMuted}; }

  /* ── Meal items ── */
  .meal-section { margin-bottom: 20px; }
  .meal-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .meal-section-title { font-size: 14px; font-weight: 700; color: ${COLORS.textPrimary}; display: flex; align-items: center; gap: 8px; }
  .meal-section-cals { font-size: 13px; color: ${COLORS.textSecondary}; font-variant-numeric: tabular-nums; }
  .food-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: ${COLORS.surface}; border-radius: 8px; margin-bottom: 6px; font-size: 13px; gap: 8px; }
  .food-name { color: ${COLORS.textPrimary}; font-weight: 500; }
  .food-meta { color: ${COLORS.textSecondary}; font-size: 12px; }
  .food-cals { color: ${COLORS.lime}; font-weight: 600; font-variant-numeric: tabular-nums; flex-shrink: 0; }

  /* ── AI Chat ── */
  .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .message { display: flex; gap: 12px; max-width: 85%; animation: fadeUp 0.3s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .message.user { flex-direction: row-reverse; align-self: flex-end; }
  .msg-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .msg-avatar.ai { background: linear-gradient(135deg, ${COLORS.violet}, ${COLORS.lime}); }
  .msg-avatar.user { background: linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet}); }
  .msg-bubble { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 12px 16px; font-size: 14px; line-height: 1.6; color: ${COLORS.textPrimary}; }
  .message.user .msg-bubble { background: ${COLORS.limeDim}; border-color: ${COLORS.lime}44; }
  .msg-bubble p { margin-bottom: 8px; }
  .msg-bubble p:last-child { margin-bottom: 0; }
  .msg-bubble strong { color: ${COLORS.lime}; }
  .msg-bubble ul { padding-left: 20px; margin: 8px 0; }
  .msg-bubble li { margin-bottom: 4px; }
  .chat-input-area { padding: 12px 16px; border-top: 1px solid ${COLORS.border}; display: flex; gap: 10px; align-items: flex-end; background: ${COLORS.surface}; }
  .chat-input { flex: 1; background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 12px 16px; font-size: 14px; color: ${COLORS.textPrimary}; font-family: 'Inter', sans-serif; outline: none; resize: none; max-height: 120px; min-height: 44px; transition: border-color 0.15s; }
  .chat-input:focus { border-color: ${COLORS.lime}; }
  .chat-input::placeholder { color: ${COLORS.textMuted}; }
  .chat-send-btn { width: 44px; height: 44px; border-radius: 12px; background: ${COLORS.lime}; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: ${COLORS.obsidian}; transition: all 0.15s; flex-shrink: 0; }
  .chat-send-btn:hover { background: ${COLORS.limeHover}; transform: scale(1.05); }
  .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .quick-prompts { padding: 0 16px 12px; display: flex; gap: 8px; flex-wrap: wrap; overflow-x: auto; }
  .quick-prompt { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; padding: 6px 12px; font-size: 12px; color: ${COLORS.textSecondary}; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .quick-prompt:hover { border-color: ${COLORS.lime}55; color: ${COLORS.lime}; background: ${COLORS.limeDim}; }

  /* ── Water tracker ── */
  .water-glasses { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .water-glass { width: 36px; height: 42px; border: 2px solid ${COLORS.border}; border-radius: 4px 4px 6px 6px; cursor: pointer; transition: all 0.15s; position: relative; overflow: hidden; background: ${COLORS.surface}; }
  .water-glass.filled { border-color: ${COLORS.cyan}; }
  .water-glass.filled::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 75%; background: linear-gradient(to top, ${COLORS.cyan}88, ${COLORS.cyan}33); }
  .water-glass:hover { border-color: ${COLORS.cyan}; transform: scale(1.05); }

  /* ── Charts ── */
  .chart-area { background: ${COLORS.surface}; border-radius: 12px; padding: 20px; position: relative; }
  .custom-chart { width: 100%; overflow: visible; }

  /* ── Streaks & badges ── */
  .streak-badge { display: inline-flex; align-items: center; gap: 6px; background: ${COLORS.amberDim}; border: 1px solid ${COLORS.amber}44; color: ${COLORS.amber}; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; }
  .tag { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: ${COLORS.violetDim}; color: #A78BFA; }
  .tag.lime { background: ${COLORS.limeDim}; color: ${COLORS.lime}; }
  .tag.cyan { background: ${COLORS.cyanDim}; color: ${COLORS.cyan}; }
  .tag.rose { background: ${COLORS.roseDim}; color: ${COLORS.rose}; }
  .tag.amber { background: ${COLORS.amberDim}; color: ${COLORS.amber}; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-success { background: #00FF8822; color: #00FF88; }
  .badge-warning { background: ${COLORS.amberDim}; color: ${COLORS.amber}; }
  .badge-danger { background: ${COLORS.roseDim}; color: ${COLORS.rose}; }
  .badge-info { background: ${COLORS.cyanDim}; color: ${COLORS.cyan}; }
  .badge-violet { background: ${COLORS.violetDim}; color: #A78BFA; }

  /* ── Modal ── */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; animation: fadeUp 0.2s ease; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid ${COLORS.border}; display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-size: 16px; font-weight: 700; color: ${COLORS.textPrimary}; }
  .modal-body { padding: 20px; }
  .modal-footer { padding: 16px 20px; border-top: 1px solid ${COLORS.border}; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }

  /* ── Tabs ── */
  .tab-bar { display: flex; gap: 4px; background: ${COLORS.surface}; padding: 4px; border-radius: 12px; margin-bottom: 20px; overflow-x: auto; }
  .tab-item { flex: 1; padding: 8px; text-align: center; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: ${COLORS.textSecondary}; border: none; background: none; transition: all 0.15s; white-space: nowrap; min-width: fit-content; }
  .tab-item.active { background: ${COLORS.lime}; color: ${COLORS.obsidian}; font-weight: 700; }

  /* ── Typing indicator ── */
  .typing-indicator { display: flex; gap: 4px; padding: 4px 0; }
  .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: ${COLORS.textSecondary}; animation: bounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1.2); opacity: 1; } }

  /* ── Auth ── */
  .auth-page { min-height: 100vh; display: flex; background: ${COLORS.obsidian}; }
  .auth-left { flex: 1; background: linear-gradient(135deg, ${COLORS.surface} 0%, #0F0F1A 100%); display: flex; align-items: center; justify-content: center; padding: 60px; border-right: 1px solid ${COLORS.border}; position: relative; overflow: hidden; }
  .auth-left::before { content: ''; position: absolute; top: -200px; right: -200px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, ${COLORS.lime}11 0%, transparent 70%); }
  .auth-right { width: 460px; display: flex; align-items: center; justify-content: center; padding: 40px; }
  .auth-form-container { width: 100%; max-width: 360px; }
  .auth-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .auth-title { font-size: 26px; font-weight: 800; color: ${COLORS.textPrimary}; margin-bottom: 8px; letter-spacing: -0.5px; }
  .auth-subtitle { font-size: 14px; color: ${COLORS.textSecondary}; margin-bottom: 32px; }
  .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: ${COLORS.textMuted}; font-size: 12px; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: ${COLORS.border}; }

  /* ── Timeline ── */
  .timeline-item { display: flex; gap: 14px; padding-bottom: 20px; position: relative; }
  .timeline-item::before { content: ''; position: absolute; left: 18px; top: 36px; bottom: 0; width: 1px; background: ${COLORS.border}; }
  .timeline-item:last-child::before { display: none; }
  .timeline-dot { width: 36px; height: 36px; border-radius: 50%; background: ${COLORS.surface}; border: 2px solid ${COLORS.border}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .timeline-content { flex: 1; }
  .timeline-title { font-size: 14px; font-weight: 600; color: ${COLORS.textPrimary}; }
  .timeline-time { font-size: 12px; color: ${COLORS.textSecondary}; margin-bottom: 4px; }
  .timeline-body { font-size: 13px; color: ${COLORS.textSecondary}; }

  /* ── Habits ── */
  .habit-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; transition: background 0.1s; cursor: pointer; }
  .habit-item:hover { background: ${COLORS.surface}; }
  .habit-check { width: 22px; height: 22px; border-radius: 6px; border: 2px solid ${COLORS.border}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; cursor: pointer; }
  .habit-check.done { background: ${COLORS.lime}; border-color: ${COLORS.lime}; color: ${COLORS.obsidian}; }
  .habit-label { font-size: 14px; color: ${COLORS.textPrimary}; font-weight: 500; }
  .habit-streak { font-size: 12px; color: ${COLORS.textSecondary}; margin-top: 2px; }

  /* ── Plan card ── */
  .plan-card { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 18px; margin-bottom: 12px; transition: all 0.15s; }
  .plan-card:hover { border-color: ${COLORS.lime}44; }
  .plan-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
  .plan-card-title { font-size: 15px; font-weight: 700; color: ${COLORS.textPrimary}; }
  .plan-card-meta { font-size: 12px; color: ${COLORS.textSecondary}; margin-top: 2px; }

  /* ── Misc ── */
  .close-btn { background: none; border: none; color: ${COLORS.textSecondary}; cursor: pointer; font-size: 18px; padding: 4px; border-radius: 6px; transition: all 0.1s; line-height: 1; }
  .close-btn:hover { color: ${COLORS.textPrimary}; background: ${COLORS.surface}; }
  .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.rose}; position: absolute; top: 6px; right: 6px; }
  @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 ${COLORS.lime}44; } 70% { box-shadow: 0 0 0 10px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
  .pulse { animation: pulse-ring 2s infinite; }
  .skeleton { background: linear-gradient(90deg, ${COLORS.border} 25%, ${COLORS.card} 50%, ${COLORS.border} 75%); background-size: 200% 100%; animation: skeleton-anim 1.5s infinite; border-radius: 8px; }
  @keyframes skeleton-anim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .page-title { font-size: 22px; font-weight: 800; color: ${COLORS.textPrimary}; letter-spacing: -0.5px; }
  .page-subtitle { font-size: 13px; color: ${COLORS.textSecondary}; margin-top: 3px; }

  /* ── Utility ── */
  .mb-4 { margin-bottom: 16px; }
  .mb-6 { margin-bottom: 24px; }
  .mt-4 { margin-top: 16px; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .w-full { width: 100%; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }

  /* ══════════════════════════════════════════
     RESPONSIVE BREAKPOINTS
  ══════════════════════════════════════════ */

  /* ── Tablet (max 1024px) ── */
  @media (max-width: 1024px) {
    .sidebar {
      transform: translateX(-240px);
      box-shadow: 4px 0 24px rgba(0,0,0,0.4);
    }
    .sidebar.open { transform: translateX(0); }
    .sidebar-close { display: flex; }
    .main { margin-left: 0; }
    .menu-btn { display: flex; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .grid-12 { grid-template-columns: 1fr; }
    .grid-21 { grid-template-columns: 1fr; }
  }

  /* ── Mobile (max 768px) ── */
  @media (max-width: 768px) {
    .page { padding: 16px; }
    .topbar { padding: 0 16px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .stat-card { padding: 14px; }
    .stat-value { font-size: 22px; }
    .grid-2 { grid-template-columns: 1fr; }
    .grid-3 { grid-template-columns: 1fr 1fr; gap: 10px; }
    .card { padding: 16px; }
    .page-header { flex-direction: column; align-items: flex-start; }
    .page-title { font-size: 20px; }
    .workout-stats { display: none; }
    .macro-bar-wrap { margin: 0 8px; }
    .modal { border-radius: 16px; }
    .modal-footer { flex-direction: column; }
    .modal-footer .btn { width: 100%; justify-content: center; }
    .chart-area { padding: 12px; }
    .message { max-width: 95%; }
  }

  /* ── Small mobile (max 480px) ── */
  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
    .stat-card { padding: 12px; }
    .stat-value { font-size: 20px; }
    .stat-icon { width: 32px; height: 32px; font-size: 14px; margin-bottom: 8px; }
    .grid-3 { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { width: 100%; padding: 24px 20px; }
    .auth-title { font-size: 22px; }
    .topbar-title { font-size: 14px; }
    .btn { padding: 8px 14px; font-size: 12px; }
    .page-header .btn { width: 100%; justify-content: center; }
    .tab-item { font-size: 11px; padding: 7px 6px; }
    .workout-item { padding: 10px; gap: 10px; }
    .workout-muscle { width: 34px; height: 34px; font-size: 16px; }
    .quick-prompts { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; }
    .quick-prompt { flex-shrink: 0; }
    .water-glass { width: 30px; height: 36px; }
  }

  /* ── Bottom nav for mobile ── */
  .bottom-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0;
    background: ${COLORS.surface}; border-top: 1px solid ${COLORS.border};
    z-index: 98; padding: 8px 0 env(safe-area-inset-bottom, 8px);
  }
  .bottom-nav-inner { display: flex; justify-content: space-around; align-items: center; }
  .bottom-nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 6px 12px; border-radius: 10px; cursor: pointer;
    border: none; background: none; color: ${COLORS.textMuted};
    font-size: 10px; font-weight: 500; transition: all 0.15s; min-width: 56px;
  }
  .bottom-nav-item .nav-icon { font-size: 20px; }
  .bottom-nav-item.active { color: ${COLORS.lime}; }
  .bottom-nav-item.active .nav-icon { filter: drop-shadow(0 0 4px ${COLORS.lime}88); }

  @media (max-width: 768px) {
    .bottom-nav { display: block; }
    .main { padding-bottom: 70px; }
  }
`;

export default css;