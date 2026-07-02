import { useState, useEffect, useRef } from "react";
import { COLORS } from "../styles/tokens";
import { sendChatMessage } from "../api/ai.api";

const QUICK_PROMPTS = [
  "Create a workout plan for today",
  "What should I eat post-workout?",
  "Am I hitting my protein goals?",
  "Suggest a high-protein meal",
  "How to improve my sleep?",
  "Calculate my ideal macros",
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "👋 Hey! I'm your AI Fitness Coach. I know your full profile — your goals, current weight, today's nutrition, and this week's workouts.\n\nI can help you with:\n- **Personalized workout plans** based on your goals\n- **Meal ideas** hitting your calorie targets\n- **Macro guidance** and supplement advice\n- **Recovery & sleep** optimization\n- **Progress analysis** and motivation\n\nWhat's on your mind today?",
};

export default function AICoachPage({ user }) {
  const [messages, setMessages]   = useState([INITIAL_MESSAGE]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const messagesEndRef            = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  // ── Send message ───────────────────────────
  const sendMessage = async (content) => {
    if (!content.trim() || loading) return;

    const userMsg    = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Send full chat history to backend
      // Backend fetches real user data and builds system prompt
      const apiMessages = newMessages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role, content: m.content }));

      const aiText = await sendChatMessage(apiMessages);
      setMessages(prev => [...prev, { role: "assistant", content: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `⚠️ ${err.message || "Connection error. Please try again."}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ── Clear chat ─────────────────────────────
  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // ── Render message with markdown-like formatting ──
  const renderMessage = (content) => {
    return content.split("\n").map((line, i) => {
      if (!line.trim()) return null;
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/^- /, "• ");
      return <p key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div style={{ padding: 0, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>

      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.lime})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            🤖
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.textPrimary }}>FitAI Coach</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.textSecondary }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88" }} />
              Online · Personalised for {user?.name?.split(" ")[0] || "you"}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge badge-violet">AI Powered</span>
            <button className="btn btn-ghost btn-sm" onClick={clearChat} title="Clear chat">🗑 Clear</button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`} style={{ display: "flex", gap: 12, maxWidth: "85%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <div className={`msg-avatar ${msg.role === "assistant" ? "ai" : "user"}`}
              style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, background: msg.role === "assistant" ? `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.lime})` : `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet})` }}
            >
              {msg.role === "assistant" ? "🤖" : avatarLetter}
            </div>
            <div className="msg-bubble" style={{
              background:   msg.role === "user" ? COLORS.limeDim : COLORS.card,
              border:       `1px solid ${msg.role === "user" ? COLORS.lime + "44" : COLORS.border}`,
              borderRadius: 16,
              padding:      "12px 16px",
              fontSize:     14,
              lineHeight:   1.6,
              color:        COLORS.textPrimary,
            }}>
              {renderMessage(msg.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 12, maxWidth: "85%" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.lime})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.textSecondary, animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: "0 20px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {QUICK_PROMPTS.map(p => (
          <div key={p} className="quick-prompt" onClick={() => sendMessage(p)}
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "6px 12px", fontSize: 12, color: COLORS.textSecondary, cursor: "pointer" }}
          >
            {p}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 10, alignItems: "flex-end", background: COLORS.surface }}>
        <textarea
          className="chat-input"
          placeholder="Ask your AI coach anything about fitness, nutrition, recovery..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          rows={1}
          style={{ flex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: COLORS.textPrimary, fontFamily: "inherit", outline: "none", resize: "none", maxHeight: 120, minHeight: 44 }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{ width: 44, height: 44, borderRadius: 12, background: loading || !input.trim() ? COLORS.border : COLORS.lime, border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: COLORS.obsidian, flexShrink: 0 }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}