"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { SavingsJar } from "@/components/SavingsJar";

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-oria-standard ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* ─── APY Bar (animated) ─── */
function ApyBar({ streak, apy, delay = 0 }: { streak: number; apy: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const maxH = 150;
  const h = (apy / 8.5) * maxH;
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <span className="text-sm font-semibold text-purple-600 tabular-nums">{apy.toFixed(1)}%</span>
      <div className="w-11 rounded-sm bg-purple-100 relative overflow-hidden border border-purple-300/20" style={{ height: maxH }}>
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-[7px] transition-all duration-1000 ease-oria-bounce"
          style={{
            height: vis ? h : 0,
            background: `linear-gradient(to top, #7c3aed, ${apy >= 7 ? "#a78bfa" : "#c4b5fd"})`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span className="text-[13px] font-medium text-purple-500">{streak}🔥</span>
    </div>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, delay = 0 }: { icon: string; title: string; desc: string; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="bg-oria-card border border-oria rounded-xl p-8 backdrop-blur-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-default">
        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-2xl mb-5">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2 tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{desc}</p>
      </div>
    </Reveal>
  );
}

/* ─── Step ─── */
function Step({ number, title, desc, delay = 0 }: { number: string; title: string; desc: string; delay?: number }) {
  return (
    <Reveal delay={delay} className="flex gap-5 items-start">
      <div className="min-w-[44px] h-[44px] rounded-full gradient-brand flex items-center justify-center text-[17px] font-bold text-white shadow-[0_4px_16px_rgba(124,58,237,0.25)]">
        {number}
      </div>
      <div>
        <h4 className="text-lg font-bold text-text-primary mb-1 tracking-tight">{title}</h4>
        <p className="text-[15px] leading-relaxed text-text-secondary">{desc}</p>
      </div>
    </Reveal>
  );
}

/* ─── Section Header ─── */
function SectionHead({ label, title, highlight, desc }: { label: string; title: string; highlight: string; desc?: string }) {
  return (
    <div className="text-center mb-14">
      <span className="text-[11px] font-semibold text-purple-600 tracking-[0.1em] uppercase">{label}</span>
      <h2 className="font-extrabold mt-3 text-text-primary tracking-tight leading-tight text-[clamp(28px,4vw,44px)]">
        {title} <span className="text-purple-600">{highlight}</span>
      </h2>
      {desc && <p className="text-base text-text-muted mt-4 max-w-[460px] mx-auto leading-relaxed">{desc}</p>}
    </div>
  );
}

/* ─── Main Landing ─── */
export default function LandingPage() {
  const [heroVis, setHeroVis] = useState(false);
  useEffect(() => {
    setTimeout(() => setHeroVis(true), 200);
  }, []);

  const apyData = [
    { s: 0, a: 4.0 }, { s: 2, a: 5.83 }, { s: 4, a: 6.72 }, { s: 6, a: 7.24 }, { s: 10, a: 8.0 },
  ];

  return (
    <div className="bg-oria-bg min-h-screen text-text-primary relative">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.3)_0%,rgba(237,233,254,0.15)_50%,transparent_70%)] blur-[40px]" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_70%)] blur-[50px]" />
        <div className="absolute bottom-[5%] right-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(221,214,254,0.25)_0%,transparent_65%)] blur-[45px]" />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-4 flex items-center justify-between bg-[rgba(250,249,255,0.75)] backdrop-blur-[20px] border-b border-oria-subtle">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] rounded-sm gradient-brand flex items-center justify-center text-base shadow-[0_2px_10px_rgba(124,58,237,0.2)]">
            🚀
          </div>
          <span className="text-[22px] font-extrabold text-text-primary tracking-tight">Oria</span>
        </div>
        <div className="flex items-center gap-7">
          <a href="#features" className="hidden sm:inline text-sm font-medium text-text-secondary hover:text-purple-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hidden sm:inline text-sm font-medium text-text-secondary hover:text-purple-600 transition-colors">How it works</a>
          <a href="#apy" className="hidden sm:inline text-sm font-medium text-text-secondary hover:text-purple-600 transition-colors">APY</a>
          <Link
            href="/onboarding"
            className="text-sm font-semibold px-[22px] py-[9px] rounded-md gradient-brand text-white shadow-[0_2px_12px_rgba(124,58,237,0.25)] hover:shadow-button transition-shadow"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center pt-20 relative z-[1]">
        <div className="max-w-[1080px] mx-auto px-6 flex items-center gap-[72px] flex-wrap justify-center">
          <div
            className={`flex-[1_1_420px] max-w-[520px] transition-all duration-[900ms] ease-oria-standard ${heroVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}
          >
            {/* Testnet badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-[5px] rounded-full bg-purple-100/70 border border-purple-300/40 mb-6">
              <span className="text-[11px] animate-pulse">🟢</span>
              <span className="text-[11px] text-purple-600 font-semibold tracking-[0.1em]">LIVE ON AVALANCHE TESTNET</span>
            </div>

            <h1 className="font-extrabold leading-[1.08] tracking-tight text-text-primary mb-6 text-[clamp(40px,5vw,56px)]">
              Save more.<br />
              <span className="bg-gradient-to-r from-purple-600 via-purple-400 to-purple-500 bg-clip-text text-transparent">Move more.</span><br />
              Earn more.
            </h1>

            <p className="text-[17px] leading-[1.7] text-text-secondary mb-8 max-w-[430px]">
              The crypto savings jar that rewards your consistency. Hit your weekly fitness goals, grow your streak, unlock up to{" "}
              <span className="text-purple-600 font-semibold">8% APY</span>. Challenge friends and save together.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/onboarding"
                className="text-base font-semibold px-[34px] py-[13px] rounded-[14px] gradient-brand text-white shadow-button hover:shadow-[0_8px_28px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 transition-all"
              >
                Start Saving
              </Link>
              <a
                href="#how-it-works"
                className="text-base font-medium px-[34px] py-[13px] rounded-[14px] border border-purple-300/40 bg-white/60 text-text-secondary hover:text-purple-600 hover:border-purple-400 transition-all backdrop-blur-sm"
              >
                How it works ↓
              </a>
            </div>
          </div>

          <div
            className={`flex-none transition-all duration-[1100ms] ease-oria-standard delay-300 ${heroVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"}`}
          >
            <SavingsJar fillPercent={72} streak={6} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 bg-oria-section border-y border-oria-subtle relative z-[1]">
        <div className="max-w-[1080px] mx-auto px-6 flex justify-around flex-wrap gap-5">
          {[
            { v: "\u20AC88B", l: "Addressable market" },
            { v: "4\u20138%", l: "Dynamic APY" },
            { v: "<2s", l: "Finality on Avalanche" },
            { v: "0", l: "Smart contract risk*" },
          ].map((s, i) => (
            <div key={i} className="text-center min-w-[130px]">
              <div className="text-[26px] font-extrabold text-purple-600 tabular-nums tracking-tight">{s.v}</div>
              <div className="text-[13px] text-text-muted mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 relative z-[1]">
        <div className="max-w-[1080px] mx-auto px-6">
          <SectionHead label="Features" title="Savings that" highlight="move with you" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-[18px]">
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
      <section id="how-it-works" className="py-28 bg-gradient-to-b from-oria-section to-transparent relative z-[1]">
        <div className="max-w-[1080px] mx-auto px-6">
          <SectionHead label="How it works" title="Three steps to" highlight="smarter saving" />
          <div className="flex flex-col gap-11 max-w-[540px] mx-auto">
            <Step number="1" title="Connect & Set Goals" desc="Sign in with email or wallet via Privy. Choose your activity (running, cycling, steps) and set a weekly km target." delay={0} />
            <Step number="2" title="Deposit & Start Earning" desc="Fund your jar with USDC or AVAX. Hit 'Start Earning' and your funds begin generating yield through Morpho's lending protocol." delay={200} />
            <Step number="3" title="Stay Consistent, Earn More" desc="Meet your weekly goal to grow your streak. Each week adds to your multiplier — 10 consecutive weeks unlocks max 8% APY." delay={400} />
          </div>
        </div>
      </section>

      {/* APY */}
      <section id="apy" className="py-28 relative z-[1]">
        <div className="max-w-[1080px] mx-auto px-6">
          <SectionHead label="Yield model" title="Your consistency," highlight="rewarded" desc="APY scales logarithmically with your streak count. Early consistency is rewarded the most." />
          <div className="flex justify-center items-end gap-8 px-12 py-11 bg-oria-card rounded-2xl border border-oria backdrop-blur-xl shadow-[0_4px_24px_rgba(124,58,237,0.06)]">
            {apyData.map((d, i) => (
              <ApyBar key={d.s} streak={d.s} apy={d.a} delay={i * 180 + 200} />
            ))}
          </div>
          <div className="text-center mt-5 text-xs text-text-muted tabular-nums">
            APY(s) = 4 + 4 x min(1, ln(1+s) / ln(11)) — powered by Morpho lending
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-28 relative z-[1]">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="gradient-surface rounded-[28px] px-10 py-16 text-center border border-oria relative overflow-hidden">
            <div className="absolute -top-[40%] -right-[10%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.2)_0%,transparent_70%)] pointer-events-none" />
            <h2 className="font-extrabold tracking-tight leading-[1.1] text-text-primary mb-4 relative text-[clamp(30px,4.5vw,48px)]">
              Ready to launch<br /><span className="text-purple-600">your goals?</span>
            </h2>
            <p className="text-[17px] text-text-secondary mb-10 relative">Try the demo and explore how Oria works.</p>
            <div className="flex gap-3 justify-center flex-wrap relative">
              <Link
                href="/onboarding"
                className="text-[15px] font-semibold px-[30px] py-[13px] rounded-md gradient-brand text-white shadow-button hover:shadow-[0_8px_28px_rgba(124,58,237,0.4)] transition-shadow"
              >
                Try the Demo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-oria-subtle py-10 relative z-[1]">
        <div className="max-w-[1080px] mx-auto px-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-purple-400 tracking-tight">Oria</span>
            <span className="text-[10px] font-semibold text-purple-400 border border-purple-300/30 px-[7px] py-[2px] rounded">MVP</span>
          </div>
          <div className="text-xs text-text-muted">Built on Avalanche · Yield by Morpho · *MVP uses simulated yield</div>
        </div>
      </footer>
    </div>
  );
}
