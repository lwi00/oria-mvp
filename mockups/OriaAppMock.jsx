import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ───
const T = {
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  purple: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" },
  bg: { primary: "#faf9ff", card: "rgba(255,255,255,0.85)", cardHover: "rgba(255,255,255,0.95)", elevated: "#ffffff", section: "rgba(237,233,254,0.3)" },
  text: { primary: "#1e1b4b", secondary: "#6b7280", muted: "#9ca3af", onPurple: "#ffffff" },
  border: { default: "rgba(196,181,253,0.2)", subtle: "rgba(196,181,253,0.1)", focus: "#7c3aed" },
  success: { 500: "#10b981", 100: "#dcfce7" },
  error: { 500: "#ef4444", 100: "#fee2e2" },
  gradient: { brand: "linear-gradient(135deg, #7c3aed, #a78bfa)", surface: "linear-gradient(135deg, rgba(237,233,254,0.8), rgba(221,214,254,0.5))" },
  shadow: { card: "0 2px 12px rgba(0,0,0,0.03)", cardHover: "0 12px 40px rgba(124,58,237,0.1), 0 2px 8px rgba(0,0,0,0.04)", button: "0 4px 20px rgba(124,58,237,0.3)", avatar: "0 2px 12px rgba(124,58,237,0.25)" },
  ease: { standard: "cubic-bezier(0.16, 1, 0.3, 1)", bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 16: 64 },
};

// ─── Mock Data ───
const USER = { name: "Talam", avatar: "TD", streak: 6, apy: 7.24, targetKm: 15, currentKm: 11.3, balance: 2450.0, earned: 34.82, weekProgress: [true, true, false, true, true, true, null] };
const FEED = [
  { id: 1, name: "Eva M.", av: "EM", event: "hit a 10-week streak", time: "2h ago", emoji: "🏆" },
  { id: 2, name: "Louis D.", av: "LD", event: "completed 18.2 km this week", time: "5h ago", emoji: "🏃" },
  { id: 3, name: "Emma D.", av: "ED", event: "joined \"Summer 10K Challenge\"", time: "1d ago", emoji: "🤝" },
  { id: 4, name: "Raph N.", av: "RN", event: "deposited 500 USDC", time: "1d ago", emoji: "💰" },
  { id: 5, name: "Louis D.", av: "LD", event: "hit a 4-week streak", time: "2d ago", emoji: "🔥" },
];
const BOARD = [
  { rank: 1, name: "Eva M.", av: "EM", streak: 10, apy: 8.0 },
  { rank: 2, name: "Talam D.", av: "TD", streak: 6, apy: 7.24, me: true },
  { rank: 3, name: "Louis D.", av: "LD", streak: 4, apy: 6.72 },
  { rank: 4, name: "Emma D.", av: "ED", streak: 3, apy: 6.33 },
  { rank: 5, name: "Raph N.", av: "RN", streak: 2, apy: 5.83 },
];
const CHALLENGES = [
  { id: 1, title: "Summer 10K Challenge", members: 4, max: 6, km: 10, ends: "5 days", progress: 0.7 },
  { id: 2, title: "Dauphine Run Club", members: 12, max: 20, km: 15, ends: "12 days", progress: 0.4 },
];

// ─── Shared Components ───
const Avatar = ({ initials, size = 36, highlight = false }) => (
  <div style={{
    width: size, height: size, borderRadius: T.radius.full, flexShrink: 0,
    background: highlight ? T.gradient.brand : `linear-gradient(135deg, ${T.purple[200]}, ${T.purple[300]})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.36, fontWeight: 700, color: highlight ? T.text.onPurple : T.purple[600],
    fontFamily: T.font, letterSpacing: "-0.02em",
    boxShadow: highlight ? T.shadow.avatar : "none",
  }}>{initials}</div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: T.bg.card, borderRadius: T.radius.xl, padding: T.space[5],
    border: `1px solid ${T.border.default}`, backdropFilter: "blur(12px)",
    boxShadow: T.shadow.card, ...style,
  }}>{children}</div>
);

const ProgressRing = ({ percent, size = 64, stroke = 5 }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const [a, setA] = useState(0);
  useEffect(() => { setTimeout(() => setA(percent), 400); }, [percent]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.purple[100]} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.purple[600]} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ - (a / 100) * circ}
          strokeLinecap="round" style={{ transition: `stroke-dashoffset 1.2s ${T.ease.bounce}` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.purple[600], fontVariantNumeric: "tabular-nums" }}>{Math.round(a)}%</span>
      </div>
    </div>
  );
};

const MiniJar = ({ fill = 65, size = 100 }) => {
  const [a, setA] = useState(0);
  useEffect(() => { setTimeout(() => setA(fill), 300); }, [fill]);
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <defs>
        <linearGradient id="mjG2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={T.purple[600]} stopOpacity="0.85" />
          <stop offset="100%" stopColor={T.purple[300]} stopOpacity="0.5" />
        </linearGradient>
        <clipPath id="mjC2"><path d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z" /></clipPath>
      </defs>
      <path d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z" fill="rgba(124,58,237,0.06)" stroke="rgba(124,58,237,0.15)" strokeWidth="1.5" />
      <g clipPath="url(#mjC2)">
        <rect x="40" y={255 - (a / 100) * 220} width="120" height={(a / 100) * 220 + 5} fill="url(#mjG2)" style={{ transition: `all 1.5s ${T.ease.bounce}` }} />
        <ellipse cx="100" cy={255 - (a / 100) * 220} rx="56" ry="5" fill="rgba(196,181,253,0.45)" style={{ transition: `all 1.5s ${T.ease.bounce}` }} />
      </g>
      <rect x="70" y="30" width="60" height="10" rx="3" fill="rgba(124,58,237,0.2)" />
      <line x1="60" y1="80" x2="60" y2="170" stroke="rgba(255,255,255,0.45)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

const WeekDots = ({ days }) => {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {days.map((met, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: T.space[1] }}>
          <div style={{
            width: 28, height: 28, borderRadius: T.radius.full,
            background: met === true ? T.gradient.brand : met === false ? T.error[100] : T.purple[100],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontFamily: T.font, fontWeight: 600,
            color: met === true ? T.text.onPurple : met === false ? T.error[500] : T.text.muted,
            border: met === null ? `2px dashed ${T.border.default}` : "none",
            boxShadow: met === true ? "0 2px 8px rgba(124,58,237,0.2)" : "none",
          }}>
            {met === true ? "✓" : met === false ? "✗" : "·"}
          </div>
          <span style={{ fontSize: 10, color: T.text.muted, fontFamily: T.font, fontWeight: 500 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── HOME TAB ───
const HomeTab = () => {
  const u = USER;
  const pct = Math.min(100, (u.currentKm / u.targetKm) * 100);
  const apySteps = [{ s: 0, a: 4.0 }, { s: 1, a: 4.58 }, { s: 2, a: 5.83 }, { s: 3, a: 6.33 }, { s: 4, a: 6.72 }, { s: 5, a: 7.0 }, { s: 6, a: 7.24 }, { s: 7, a: 7.44 }, { s: 8, a: 7.62 }, { s: 9, a: 7.82 }, { s: 10, a: 8.0 }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space[4] }}>
      {/* Streak hero */}
      <Card style={{ background: T.gradient.surface, padding: T.space[6], position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -20, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.text.secondary, marginBottom: T.space[1] }}>Current streak</div>
            <div style={{ fontFamily: T.font, fontSize: 44, fontWeight: 800, color: T.text.primary, lineHeight: 1, letterSpacing: "-0.03em" }}>
              {u.streak}<span style={{ fontSize: 32 }}>🔥</span>
            </div>
            <div style={{ fontFamily: T.font, fontSize: 14, color: T.purple[600], marginTop: T.space[2], fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{u.apy.toFixed(2)}% APY</div>
          </div>
          <MiniJar fill={pct} size={100} />
        </div>
        <div style={{ marginTop: T.space[4] }}><WeekDots days={u.weekProgress} /></div>
      </Card>

      {/* Weekly progress */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: T.space[4] }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.text.muted, marginBottom: 2 }}>This week</div>
            <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.text.primary, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
              {u.currentKm} <span style={{ fontSize: 14, color: T.text.secondary, fontWeight: 400 }}>/ {u.targetKm} km</span>
            </div>
          </div>
          <ProgressRing percent={pct} />
        </div>
        <div style={{ height: 8, borderRadius: T.space[1], background: T.purple[100], overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: T.space[1], background: `linear-gradient(90deg, ${T.purple[600]}, ${T.purple[400]})`, width: `${pct}%`, transition: "width 1s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: T.space[2] }}>
          <span style={{ fontFamily: T.font, fontSize: 12, color: T.text.muted }}>{(u.targetKm - u.currentKm).toFixed(1)} km remaining</span>
          <span style={{ fontFamily: T.font, fontSize: 12, color: T.purple[600], fontWeight: 500 }}>via Strava</span>
        </div>
      </Card>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.space[3] }}>
        <Card style={{ padding: `${T.space[4]}px ${T.space[5] - 2}px` }}>
          <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.text.muted, marginBottom: T.space[1] }}>Balance</div>
          <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.text.primary, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>${u.balance.toLocaleString()}</div>
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.success[500], fontWeight: 600, marginTop: 2 }}>+${u.earned} earned</div>
        </Card>
        <Card style={{ padding: `${T.space[4]}px ${T.space[5] - 2}px` }}>
          <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.text.muted, marginBottom: T.space[1] }}>Current APY</div>
          <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.purple[600], fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{u.apy}%</div>
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.text.muted, marginTop: 2 }}>max 8% at 10🔥</div>
        </Card>
      </div>

      {/* APY mini chart */}
      <Card>
        <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text.primary, marginBottom: T.space[4], letterSpacing: "-0.01em" }}>APY Progression</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {apySteps.map((d) => (
            <div key={d.s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{
                width: "100%", borderRadius: T.space[1],
                height: `${(d.a / 8.5) * 70}px`,
                background: d.s <= u.streak ? `linear-gradient(to top, ${T.purple[600]}, ${T.purple[400]})` : T.purple[100],
                border: d.s === u.streak ? `2px solid ${T.purple[600]}` : "none",
                boxShadow: d.s === u.streak ? "0 0 8px rgba(124,58,237,0.3)" : "none",
              }} />
              <span style={{ fontFamily: T.font, fontSize: 8, fontWeight: 500, color: d.s === u.streak ? T.purple[600] : T.text.muted, fontVariantNumeric: "tabular-nums" }}>{d.s}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: T.space[2] }}>
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.text.muted }}>Streak weeks</span>
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.purple[600], fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>You are here: {u.streak}🔥</span>
        </div>
      </Card>

      {/* Friends preview */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.space[3] }}>
          <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text.primary, letterSpacing: "-0.01em" }}>Friends Activity</span>
          <span style={{ fontFamily: T.font, fontSize: 12, color: T.purple[600], fontWeight: 500, cursor: "pointer" }}>See all →</span>
        </div>
        {FEED.slice(0, 3).map((f) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: T.space[3], padding: `${T.space[2]}px 0`, borderBottom: `1px solid ${T.purple[100]}80` }}>
            <Avatar initials={f.av} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.font, fontSize: 13, color: T.text.primary }}><span style={{ fontWeight: 600 }}>{f.name}</span> {f.event}</div>
              <div style={{ fontFamily: T.font, fontSize: 11, color: T.text.muted }}>{f.time}</div>
            </div>
            <span style={{ fontSize: 18 }}>{f.emoji}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── SOCIAL TAB ───
const SocialTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: T.space[4] }}>
    <Card>
      <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text.primary, marginBottom: T.space[4], letterSpacing: "-0.01em" }}>🏅 Friends Leaderboard</div>
      {BOARD.map((p) => (
        <div key={p.rank} style={{
          display: "flex", alignItems: "center", gap: T.space[3], padding: `${T.space[3]}px ${T.space[3]}px`,
          borderRadius: T.radius.lg - 2, marginBottom: 6,
          background: p.me ? T.gradient.surface : "transparent",
          border: p.me ? `1px solid ${T.purple[300]}40` : "1px solid transparent",
        }}>
          <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: p.rank <= 3 ? T.purple[600] : T.text.muted, width: 24, textAlign: "center" }}>
            {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : `#${p.rank}`}
          </span>
          <Avatar initials={p.av} size={34} highlight={p.me} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: p.me ? 700 : 500, color: T.text.primary }}>
              {p.name} {p.me && <span style={{ fontSize: 11, color: T.purple[600], fontWeight: 600 }}>(you)</span>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.purple[600], fontVariantNumeric: "tabular-nums" }}>{p.streak}🔥</div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.text.muted, fontVariantNumeric: "tabular-nums" }}>{p.apy}%</div>
          </div>
        </div>
      ))}
    </Card>
    <Card>
      <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text.primary, marginBottom: T.space[4], letterSpacing: "-0.01em" }}>📢 Activity Feed</div>
      {FEED.map((f, i) => (
        <div key={f.id} style={{ display: "flex", gap: T.space[3], padding: `${T.space[3]}px 0`, borderBottom: i < FEED.length - 1 ? `1px solid ${T.purple[100]}80` : "none" }}>
          <Avatar initials={f.av} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.font, fontSize: 14, color: T.text.primary, lineHeight: 1.4 }}>
              <span style={{ fontWeight: 600 }}>{f.name}</span> {f.event} <span style={{ fontSize: 16 }}>{f.emoji}</span>
            </div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: T.text.muted, marginTop: 2 }}>{f.time}</div>
          </div>
        </div>
      ))}
    </Card>
  </div>
);

// ─── CHALLENGES TAB ───
const ChallengesTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: T.space[4] }}>
    <button style={{
      fontFamily: T.font, fontSize: 15, fontWeight: 600, padding: `${T.space[4]}px`,
      borderRadius: T.radius.lg, border: `2px dashed ${T.purple[300]}60`, background: T.bg.section,
      color: T.purple[600], cursor: "pointer", width: "100%",
    }}>+ Create Challenge</button>
    {CHALLENGES.map((c) => (
      <Card key={c.id}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: T.space[3] }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text.primary, letterSpacing: "-0.01em" }}>{c.title}</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.text.muted, marginTop: 2 }}>{c.km} km/week · ends in {c.ends}</div>
          </div>
          <div style={{ padding: `${T.space[1]}px ${T.space[3]}px`, borderRadius: T.radius.sm, background: T.purple[100], fontFamily: T.font, fontSize: 12, color: T.purple[600], fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{c.members}/{c.max}</div>
        </div>
        <div style={{ height: 8, borderRadius: T.space[1], background: T.purple[100], overflow: "hidden", marginBottom: T.space[3] }}>
          <div style={{ height: "100%", borderRadius: T.space[1], background: `linear-gradient(90deg, ${T.purple[600]}, ${T.purple[400]})`, width: `${c.progress * 100}%` }} />
        </div>
        <div style={{ display: "flex" }}>
          {["EM", "LD", "TD", "ED"].slice(0, Math.min(4, c.members)).map((a, i) => (
            <div key={i} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }}><Avatar initials={a} size={28} /></div>
          ))}
          {c.members > 4 && (
            <div style={{ marginLeft: -8, width: 28, height: 28, borderRadius: T.radius.full, background: T.purple[100], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: T.purple[600], fontFamily: T.font }}>+{c.members - 4}</div>
          )}
        </div>
      </Card>
    ))}
  </div>
);

// ─── WALLET TAB ───
const WalletTab = () => {
  const u = USER;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: T.space[4] }}>
      <Card style={{ background: T.gradient.surface, padding: `${T.space[8] - 4}px ${T.space[6]}px`, textAlign: "center" }}>
        <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.text.secondary }}>Total Balance</div>
        <div style={{ fontFamily: T.font, fontSize: 44, fontWeight: 800, color: T.text.primary, marginTop: T.space[1], letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
          ${u.balance.toLocaleString()}<span style={{ fontSize: 20, color: T.text.muted }}>.00</span>
        </div>
        <div style={{ fontFamily: T.font, fontSize: 14, color: T.success[500], marginTop: T.space[2], fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>+${u.earned} earned from yield</div>
        <div style={{ display: "flex", gap: T.space[3], justifyContent: "center", marginTop: T.space[5] }}>
          <button style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, padding: `11px ${T.space[8] - 4}px`, borderRadius: T.radius.md, border: "none", background: T.gradient.brand, color: T.text.onPurple, cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.25)" }}>Deposit</button>
          <button style={{ fontFamily: T.font, fontSize: 14, fontWeight: 500, padding: `11px ${T.space[8] - 4}px`, borderRadius: T.radius.md, border: `1px solid ${T.border.default}`, background: "rgba(255,255,255,0.7)", color: T.text.secondary, cursor: "pointer" }}>Withdraw</button>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text.primary, letterSpacing: "-0.01em" }}>Earning Status</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.text.muted, marginTop: 2 }}>via Morpho lending on Avalanche</div>
          </div>
          <div style={{ padding: `6px ${T.space[4]}px`, borderRadius: T.radius.xl, background: T.success[100], fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.success[500] }}>Active</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: T.space[3], marginTop: T.space[5] - 2 }}>
          {[
            { label: "Deposited", value: `$${(u.balance - u.earned).toLocaleString()}`, color: T.text.primary },
            { label: "Earned", value: `$${u.earned}`, color: T.success[500] },
            { label: "APY", value: `${u.apy}%`, color: T.purple[600] },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center", padding: `${T.space[3]}px 0`, borderRadius: T.radius.md, background: T.bg.section }}>
              <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 500, color: T.text.muted }}>{s.label}</div>
              <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 800, color: s.color, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text.primary, marginBottom: T.space[4], letterSpacing: "-0.01em" }}>Recent Transactions</div>
        {[
          { type: "Deposit", amount: "+500 USDC", time: "Mar 1, 2026", icon: "↓", color: T.success[500] },
          { type: "Yield", amount: "+2.41 USDC", time: "Feb 28, 2026", icon: "✦", color: T.purple[600] },
          { type: "Deposit", amount: "+1,000 USDC", time: "Feb 15, 2026", icon: "↓", color: T.success[500] },
          { type: "Yield", amount: "+1.87 USDC", time: "Feb 14, 2026", icon: "✦", color: T.purple[600] },
          { type: "Deposit", amount: "+950 USDC", time: "Feb 1, 2026", icon: "↓", color: T.success[500] },
        ].map((tx, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: T.space[3], padding: `${T.space[3]}px 0`, borderBottom: i < 4 ? `1px solid ${T.purple[100]}80` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: T.radius.sm, background: T.purple[100], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: tx.color }}>{tx.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 500, color: T.text.primary }}>{tx.type}</div>
              <div style={{ fontFamily: T.font, fontSize: 12, color: T.text.muted }}>{tx.time}</div>
            </div>
            <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: tx.color, fontVariantNumeric: "tabular-nums" }}>{tx.amount}</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── TAB BAR ───
const TabBar = ({ active, onChange }) => {
  const tabs = [{ id: "home", label: "Home", icon: "🏠" }, { id: "social", label: "Social", icon: "👥" }, { id: "challenges", label: "Challenges", icon: "🏆" }, { id: "wallet", label: "Wallet", icon: "💰" }];
  return (
    <div style={{
      display: "flex", justifyContent: "space-around", padding: `${T.space[3]}px 0 ${T.space[4]}px`,
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderTop: `1px solid ${T.border.default}`, position: "sticky", bottom: 0, zIndex: 50,
    }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          background: "none", border: "none", cursor: "pointer", padding: `${T.space[1]}px ${T.space[4]}px`,
        }}>
          <span style={{ fontSize: 20, filter: active === t.id ? "none" : "grayscale(0.6) opacity(0.5)" }}>{t.icon}</span>
          <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: active === t.id ? 600 : 400, color: active === t.id ? T.purple[600] : T.text.muted }}>{t.label}</span>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: T.radius.full, background: T.purple[600], marginTop: 1 }} />}
        </button>
      ))}
    </div>
  );
};

// ─── MAIN APP ───
export default function OriaApp() {
  const [tab, setTab] = useState("home");
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:${T.bg.primary}}
      ::selection{background:rgba(124,58,237,.2)}
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-thumb{background:${T.purple[300]}50;border-radius:4px}
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: T.bg.primary,
      display: "flex", flexDirection: "column", position: "relative",
      boxShadow: "0 0 60px rgba(124,58,237,0.06)",
      borderLeft: `1px solid ${T.border.default}`, borderRight: `1px solid ${T.border.default}`,
    }}>
      {/* Background blobs */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 420, height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "-20%", width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(circle, ${T.purple[300]}33 0%, transparent 70%)`, filter: "blur(30px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "-15%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${T.purple[200]}33 0%, transparent 70%)`, filter: "blur(30px)" }} />
      </div>

      {/* Header */}
      <div style={{
        padding: `${T.space[4]}px ${T.space[5]}px`, display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(250,249,255,0.8)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50,
        borderBottom: `1px solid ${T.border.default}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.space[3] }}>
          <div style={{ width: 30, height: 30, borderRadius: T.radius.sm, background: T.gradient.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🚀</div>
          <span style={{ fontFamily: T.font, fontSize: 20, fontWeight: 800, color: T.text.primary, letterSpacing: "-0.03em" }}>Oria</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: T.space[3] }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 20, cursor: "pointer" }}>🔔</span>
            <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: T.radius.full, background: T.error[500], border: "2px solid white" }} />
          </div>
          <Avatar initials="TD" size={32} highlight />
        </div>
      </div>

      {/* Page title */}
      <div style={{ padding: `${T.space[5] - 2}px ${T.space[5]}px ${T.space[2]}px`, position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.text.muted }}>
          Hello, <span style={{ color: T.text.primary, fontWeight: 600 }}>{USER.name}</span> 👋
        </div>
        <h1 style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.text.primary, marginTop: 2, letterSpacing: "-0.02em" }}>
          {{ home: "Dashboard", social: "Friends", challenges: "Challenges", wallet: "Wallet" }[tab]}
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: `${T.space[3]}px ${T.space[4]}px ${T.space[5]}px`, position: "relative", zIndex: 1 }}>
        {tab === "home" && <HomeTab />}
        {tab === "social" && <SocialTab />}
        {tab === "challenges" && <ChallengesTab />}
        {tab === "wallet" && <WalletTab />}
      </div>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
