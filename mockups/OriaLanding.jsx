import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ───
const T = {
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  purple: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" },
  bg: { primary: "#faf9ff", card: "rgba(255,255,255,0.85)", cardHover: "rgba(255,255,255,0.95)", section: "rgba(237,233,254,0.3)" },
  text: { primary: "#1e1b4b", secondary: "#6b7280", muted: "#9ca3af", onPurple: "#ffffff" },
  border: { default: "rgba(196,181,253,0.2)", subtle: "rgba(196,181,253,0.1)", focus: "#7c3aed" },
  gradient: { brand: "linear-gradient(135deg, #7c3aed, #a78bfa)", surface: "linear-gradient(135deg, rgba(237,233,254,0.8), rgba(221,214,254,0.5))", jar: "url(#jarGradLP)" },
  shadow: { card: "0 2px 12px rgba(0,0,0,0.03)", cardHover: "0 12px 40px rgba(124,58,237,0.1), 0 2px 8px rgba(0,0,0,0.04)", button: "0 4px 20px rgba(124,58,237,0.3)", buttonHover: "0 8px 28px rgba(124,58,237,0.4)" },
  ease: { standard: "cubic-bezier(0.16, 1, 0.3, 1)", bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 16: 64 },
};

// ─── Savings Jar SVG ───
const SavingsJar = ({ fillPercent = 65, streak = 6 }) => {
  const [anim, setAnim] = useState(0);
  useEffect(() => { setTimeout(() => setAnim(fillPercent), 400); }, [fillPercent]);
  return (
    <div style={{ position: "relative", width: 240, height: 320 }}>
      <svg viewBox="0 0 200 280" width="240" height="320">
        <defs>
          <linearGradient id="jarGradLP" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={T.purple[600]} stopOpacity="0.85" />
            <stop offset="50%" stopColor={T.purple[400]} stopOpacity="0.7" />
            <stop offset="100%" stopColor={T.purple[300]} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="glassLP" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(124,58,237,0.06)" />
            <stop offset="100%" stopColor="rgba(196,181,253,0.08)" />
          </linearGradient>
          <clipPath id="jarClipLP"><path d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z" /></clipPath>
        </defs>
        <path d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z" fill="url(#glassLP)" stroke="rgba(124,58,237,0.15)" strokeWidth="1.5" />
        <g clipPath="url(#jarClipLP)">
          <rect x="40" y={255 - (anim / 100) * 220} width="120" height={(anim / 100) * 220 + 5} fill="url(#jarGradLP)" style={{ transition: `y 1.8s ${T.ease.bounce}, height 1.8s ${T.ease.bounce}` }} />
          <ellipse cx="100" cy={255 - (anim / 100) * 220} rx="56" ry="5" fill="rgba(196,181,253,0.45)" style={{ transition: `cy 1.8s ${T.ease.bounce}` }} />
        </g>
        <rect x="70" y="30" width="60" height="10" rx="3" fill="rgba(124,58,237,0.2)" />
        <line x1="60" y1="80" x2="60" y2="170" stroke="rgba(255,255,255,0.45)" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", bottom: 16, right: -8,
        background: T.gradient.brand, borderRadius: T.radius.full,
        width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `${T.shadow.button}, 0 0 0 4px rgba(255,255,255,0.9)`,
      }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: T.text.onPurple }}>{streak}🔥</span>
      </div>
    </div>
  );
};

// ─── Background blobs ───
const Blobs = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(196,181,253,0.3) 0%, rgba(237,233,254,0.15) 50%, transparent 70%)`, filter: "blur(40px)" }} />
    <div style={{ position: "absolute", top: "40%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)`, filter: "blur(50px)" }} />
    <div style={{ position: "absolute", bottom: "5%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(221,214,254,0.25) 0%, transparent 65%)`, filter: "blur(45px)" }} />
  </div>
);

// ─── APY Bar ───
const ApyBar = ({ streak, apy, delay = 0 }) => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const maxH = 150, h = (apy / 8.5) * maxH;
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: T.space[2] }}>
      <span style={{ fontFamily: T.font, fontSize: 14, color: T.purple[600], fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{apy.toFixed(1)}%</span>
      <div style={{ width: 44, height: maxH, borderRadius: T.radius.sm, background: T.purple[100], position: "relative", overflow: "hidden", border: `1px solid ${T.purple[300]}30` }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: vis ? h : 0, background: `linear-gradient(to top, ${T.purple[600]}, ${apy >= 7 ? T.purple[400] : T.purple[300]})`, borderRadius: `0 0 ${T.radius.sm - 1}px ${T.radius.sm - 1}px`, transition: `height 1s ${T.ease.bounce} ${delay}ms` }} />
      </div>
      <span style={{ fontFamily: T.font, fontSize: 13, color: T.purple[500], fontWeight: 500 }}>{streak}🔥</span>
    </div>
  );
};

// ─── Feature Card ───
const FeatureCard = ({ icon, title, desc, delay = 0 }) => {
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? T.bg.cardHover : T.bg.card, border: `1px solid ${hov ? T.purple[300] + "50" : T.border.default}`,
      borderRadius: T.radius.xl, padding: `${T.space[8]}px ${T.space[6]}px`, backdropFilter: "blur(12px)",
      opacity: vis ? 1 : 0, transform: vis ? (hov ? "translateY(-4px)" : "translateY(0)") : "translateY(24px)",
      transition: `all 0.5s ${T.ease.standard} ${vis ? 0 : delay}ms`,
      boxShadow: hov ? T.shadow.cardHover : T.shadow.card, cursor: "default",
    }}>
      <div style={{ width: 48, height: 48, borderRadius: T.radius.lg - 2, background: `linear-gradient(135deg, ${T.purple[100]}, ${T.purple[200]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: T.space[5] }}>{icon}</div>
      <h3 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.text.primary, marginBottom: T.space[2], letterSpacing: "-0.015em" }}>{title}</h3>
      <p style={{ fontFamily: T.font, fontSize: 14, lineHeight: 1.6, color: T.text.secondary, margin: 0 }}>{desc}</p>
    </div>
  );
};

// ─── Step ───
const Step = ({ number, title, desc, delay = 0 }) => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", gap: T.space[5], alignItems: "flex-start", opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-20px)", transition: `all 0.6s ease ${delay}ms` }}>
      <div style={{ minWidth: 44, height: 44, borderRadius: T.radius.full, background: T.gradient.brand, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font, fontSize: 17, fontWeight: 700, color: T.text.onPurple, boxShadow: `0 4px 16px rgba(124,58,237,0.25)` }}>{number}</div>
      <div>
        <h4 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.text.primary, marginBottom: T.space[1], letterSpacing: "-0.015em" }}>{title}</h4>
        <p style={{ fontFamily: T.font, fontSize: 15, lineHeight: 1.6, color: T.text.secondary, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
};

// ─── Main Landing ───
export default function OriaLanding() {
  const [heroVis, setHeroVis] = useState(false);
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      *{margin:0;padding:0;box-sizing:border-box}
      html{scroll-behavior:smooth}
      body{background:${T.bg.primary};overflow-x:hidden}
      ::selection{background:rgba(124,58,237,.2);color:${T.text.primary}}
    `;
    document.head.appendChild(style);
    setTimeout(() => setHeroVis(true), 200);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const apyData = [{ s: 0, a: 4.0 }, { s: 2, a: 5.83 }, { s: 4, a: 6.72 }, { s: 6, a: 7.24 }, { s: 10, a: 8.0 }];
  const sec = { maxWidth: 1080, margin: "0 auto", padding: `0 ${T.space[6]}px` };

  // Shared section header
  const SectionHead = ({ label, title, highlight, desc }) => (
    <div style={{ textAlign: "center", marginBottom: T.space[16] - 8 }}>
      <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.purple[600], letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
      <h2 style={{ fontFamily: T.font, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: T.space[3], color: T.text.primary, letterSpacing: "-0.025em", lineHeight: 1.15 }}>
        {title} <span style={{ color: T.purple[600] }}>{highlight}</span>
      </h2>
      {desc && <p style={{ fontFamily: T.font, fontSize: 16, color: T.text.muted, marginTop: T.space[4], maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>{desc}</p>}
    </div>
  );

  // Button components
  const BtnPrimary = ({ children }) => {
    const [h, setH] = useState(false);
    return <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      fontFamily: T.font, fontSize: 16, fontWeight: 600, padding: "13px 34px", borderRadius: T.radius.lg - 2,
      border: "none", background: T.gradient.brand, color: T.text.onPurple, cursor: "pointer",
      boxShadow: h ? T.shadow.buttonHover : T.shadow.button, transform: h ? "translateY(-2px)" : "translateY(0)",
      transition: "all 0.3s", letterSpacing: "-0.01em",
    }}>{children}</button>;
  };

  const BtnSecondary = ({ children }) => {
    const [h, setH] = useState(false);
    return <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      fontFamily: T.font, fontSize: 16, fontWeight: 500, padding: "13px 34px", borderRadius: T.radius.lg - 2,
      border: `1px solid ${h ? T.purple[400] : T.purple[300] + "66"}`, background: "rgba(255,255,255,0.6)",
      color: h ? T.purple[600] : T.text.secondary, cursor: "pointer", transition: "all 0.3s", backdropFilter: "blur(8px)",
    }}>{children}</button>;
  };

  return (
    <div style={{ background: T.bg.primary, minHeight: "100vh", color: T.text.primary, position: "relative" }}>
      <Blobs />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: `${T.space[4]}px ${T.space[8]}px`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(250,249,255,0.75)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border.subtle}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.space[3] }}>
          <div style={{ width: 34, height: 34, borderRadius: T.radius.sm, background: T.gradient.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 2px 10px rgba(124,58,237,0.2)" }}>🚀</div>
          <span style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.text.primary, letterSpacing: "-0.03em" }}>Oria</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: T.space[8] - 4 }}>
          {["Features", "How it works", "APY"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{
              fontFamily: T.font, fontSize: 14, fontWeight: 500, color: T.text.secondary,
              textDecoration: "none", transition: "color 0.2s",
            }} onMouseEnter={(e) => (e.target.style.color = T.purple[600])} onMouseLeave={(e) => (e.target.style.color = T.text.secondary)}>{item}</a>
          ))}
          <button style={{
            fontFamily: T.font, fontSize: 14, fontWeight: 600, padding: "9px 22px", borderRadius: T.radius.md,
            border: "none", background: T.gradient.brand, color: T.text.onPurple, cursor: "pointer",
            boxShadow: "0 2px 12px rgba(124,58,237,0.25)", transition: "all 0.3s",
          }}>Launch App</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
        <div style={{ ...sec, display: "flex", alignItems: "center", gap: 72, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{
            flex: "1 1 420px", maxWidth: 520, opacity: heroVis ? 1 : 0,
            transform: heroVis ? "translateY(0)" : "translateY(30px)", transition: `all 0.9s ${T.ease.standard}`,
          }}>
            {/* Testnet badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: T.space[2], padding: "5px 14px", borderRadius: T.radius.full, background: T.purple[100] + "b3", border: `1px solid ${T.purple[300]}66`, marginBottom: T.space[6] }}>
              <span style={{ fontSize: 11, animation: "pulse 2s infinite" }}>🟢</span>
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.purple[600], fontWeight: 600, letterSpacing: "0.1em" }}>LIVE ON AVALANCHE TESTNET</span>
            </div>

            <h1 style={{ fontFamily: T.font, fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", color: T.text.primary, marginBottom: T.space[6] }}>
              Save more.<br />
              <span style={{ background: `linear-gradient(135deg, ${T.purple[600]}, ${T.purple[400]}, ${T.purple[500]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Move more.</span><br />
              Earn more.
            </h1>

            <p style={{ fontFamily: T.font, fontSize: 17, lineHeight: 1.7, color: T.text.secondary, marginBottom: T.space[8], maxWidth: 430 }}>
              The crypto savings jar that rewards your consistency. Hit your weekly fitness goals, grow your streak, unlock up to{" "}
              <span style={{ color: T.purple[600], fontWeight: 600 }}>8% APY</span>. Challenge friends and save together.
            </p>

            <div style={{ display: "flex", gap: T.space[4], flexWrap: "wrap" }}>
              <BtnPrimary>Start Saving</BtnPrimary>
              <BtnSecondary>How it works ↓</BtnSecondary>
            </div>
          </div>

          <div style={{ flex: "0 0 auto", opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(50px)", transition: `all 1.1s ${T.ease.standard} 0.3s` }}>
            <SavingsJar fillPercent={72} streak={6} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: `${T.space[10]}px 0`, background: T.bg.section, borderTop: `1px solid ${T.border.subtle}`, borderBottom: `1px solid ${T.border.subtle}` }}>
        <div style={{ ...sec, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: T.space[5] }}>
          {[{ v: "€88B", l: "Addressable market" }, { v: "4–8%", l: "Dynamic APY" }, { v: "<2s", l: "Finality on Avalanche" }, { v: "0", l: "Smart contract risk*" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 130 }}>
              <div style={{ fontFamily: T.font, fontSize: 26, fontWeight: 800, color: T.purple[600], fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{s.v}</div>
              <div style={{ fontFamily: T.font, fontSize: 13, color: T.text.muted, marginTop: T.space[1] }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: `110px 0` }}>
        <div style={sec}>
          <SectionHead label="Features" title="Savings that" highlight="move with you" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: T.space[5] - 2 }}>
            <FeatureCard icon="🏺" title="Programmable Jars" desc="Set a weekly running target. Your jar fills as you hit milestones. Visual progress that makes saving tangible and satisfying." delay={0} />
            <FeatureCard icon="🔥" title="Streak-Boosted Yield" desc="Base APY starts at 4%. Every consecutive week you meet your goal, your rate climbs — up to 8%. Powered by Morpho lending." delay={120} />
            <FeatureCard icon="🤝" title="Social Challenges" desc="Create group challenges with friends. Compete on leaderboards, share milestones, and unlock multiplier bonuses together." delay={240} />
            <FeatureCard icon="⛓️" title="Non-Custodial" desc="Your keys, your funds. Built on Avalanche with Privy embedded wallets — no seed phrase needed, instant onboarding." delay={360} />
            <FeatureCard icon="📊" title="Activity Tracking" desc="Connect Strava or Apple Health. We verify your workouts automatically and update your streak every week." delay={480} />
            <FeatureCard icon="🎯" title="Milestone Unlocks" desc="Hit 5 weeks? Unlock social sharing. 10 weeks? Earn max APY. Suggested progression paths keep you motivated." delay={600} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "110px 0", background: `linear-gradient(180deg, ${T.bg.section} 0%, rgba(250,249,255,0) 100%)` }}>
        <div style={sec}>
          <SectionHead label="How it works" title="Three steps to" highlight="smarter saving" />
          <div style={{ display: "flex", flexDirection: "column", gap: T.space[10] + 4, maxWidth: 540, margin: "0 auto" }}>
            <Step number="1" title="Connect & Set Goals" desc="Sign in with email or wallet via Privy. Choose your activity (running, cycling, steps) and set a weekly km target." delay={0} />
            <Step number="2" title="Deposit & Start Earning" desc="Fund your jar with USDC or AVAX. Hit 'Start Earning' and your funds begin generating yield through Morpho's lending protocol." delay={200} />
            <Step number="3" title="Stay Consistent, Earn More" desc="Meet your weekly goal to grow your streak. Each week adds to your multiplier — 10 consecutive weeks unlocks max 8% APY." delay={400} />
          </div>
        </div>
      </section>

      {/* APY */}
      <section id="apy" style={{ padding: "110px 0" }}>
        <div style={sec}>
          <SectionHead label="Yield model" title="Your consistency," highlight="rewarded" desc="APY scales logarithmically with your streak count. Early consistency is rewarded the most." />
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "flex-end", gap: T.space[8],
            padding: `${T.space[10] + 4}px ${T.space[10] + 8}px`, background: T.bg.card, borderRadius: T.radius.xxl,
            border: `1px solid ${T.border.default}`, backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(124,58,237,0.06)",
          }}>
            {apyData.map((d, i) => <ApyBar key={d.s} streak={d.s} apy={d.a} delay={i * 180 + 200} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: T.space[5], fontFamily: T.font, fontSize: 12, color: T.text.muted, fontVariantNumeric: "tabular-nums" }}>
            APY(s) = 4 + 4 × min(1, ln(1+s) / ln(11)) — powered by Morpho lending
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: `80px 0 110px` }}>
        <div style={{ ...sec, position: "relative" }}>
          <div style={{
            background: T.gradient.surface, borderRadius: T.radius.xxl + 4, padding: `${T.space[16]}px ${T.space[10]}px`,
            textAlign: "center", border: `1px solid ${T.border.default}`, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)`, pointerEvents: "none" }} />
            <h2 style={{ fontFamily: T.font, fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: T.text.primary, marginBottom: T.space[4], position: "relative" }}>
              Ready to launch<br /><span style={{ color: T.purple[600] }}>your goals?</span>
            </h2>
            <p style={{ fontFamily: T.font, fontSize: 17, color: T.text.secondary, marginBottom: T.space[10], position: "relative" }}>Join the waitlist. Be among the first to save smarter.</p>
            <div style={{ display: "flex", gap: T.space[3], justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <input type="email" placeholder="your@email.com" style={{
                fontFamily: T.font, fontSize: 15, padding: "13px 20px", borderRadius: T.radius.md,
                border: `1px solid ${T.purple[300]}66`, background: "rgba(255,255,255,0.8)", color: T.text.primary,
                outline: "none", width: 260, backdropFilter: "blur(8px)",
              }} onFocus={(e) => (e.target.style.borderColor = T.border.focus)} onBlur={(e) => (e.target.style.borderColor = T.purple[300] + "66")} />
              <button style={{
                fontFamily: T.font, fontSize: 15, fontWeight: 600, padding: "13px 30px", borderRadius: T.radius.md,
                border: "none", background: T.gradient.brand, color: T.text.onPurple, cursor: "pointer",
                boxShadow: T.shadow.button, transition: "all 0.3s",
              }}>Join Waitlist →</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${T.border.subtle}`, padding: `${T.space[10]}px 0` }}>
        <div style={{ ...sec, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: T.space[4] }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.space[2] }}>
            <span style={{ fontFamily: T.font, fontSize: 18, fontWeight: 800, color: T.purple[400], letterSpacing: "-0.02em" }}>Oria</span>
            <span style={{ fontFamily: T.font, fontSize: 10, fontWeight: 600, color: T.purple[400], border: `1px solid ${T.purple[300]}50`, padding: "2px 7px", borderRadius: T.radius.sm / 2 }}>MVP</span>
          </div>
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.text.muted }}>Built on Avalanche · Yield by Morpho · *MVP uses simulated yield</div>
        </div>
      </footer>
    </div>
  );
}
