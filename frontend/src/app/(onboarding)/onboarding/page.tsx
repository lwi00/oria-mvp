"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { MiniJar } from "@/components/MiniJar";

const STEPS = 4;

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current
              ? "w-6 gradient-brand"
              : i < current
                ? "w-2 bg-purple-400"
                : "w-2 bg-purple-100"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Step 1: Welcome ───
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-10">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center shadow-button">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L13.09 8.26L18 4L14.74 9.91L21 11L14.74 12.09L18 18L13.09 13.74L12 20L10.91 13.74L6 18L9.26 12.09L3 11L9.26 9.91L6 4L10.91 8.26L12 2Z"
              fill="white"
            />
          </svg>
        </div>
        <span className="text-[32px] font-extrabold text-text-primary tracking-tight">
          Oria
        </span>
      </div>

      <h1 className="text-[22px] font-bold text-text-primary text-center tracking-tight mb-3">
        Save more. Move more. Earn more.
      </h1>
      <p className="text-[15px] text-text-secondary text-center leading-relaxed max-w-[300px]">
        Deposit crypto, stay active, and watch your savings grow with higher
        yields for every streak you build.
      </p>

      <div className="w-full mt-12 flex flex-col items-center gap-4">
        <button
          onClick={onNext}
          className="w-full h-[52px] rounded-[14px] gradient-brand text-white font-semibold text-base shadow-button cursor-pointer border-none"
        >
          Get Started
        </button>
        <span className="text-[13px] text-purple-400 cursor-pointer">
          Already have an account? Sign in
        </span>
      </div>
    </div>
  );
}

// ─── Step 2: Connect Wallet ───
function ConnectWalletStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const loginOptions = [
    {
      label: "Continue with Email",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 4L12 13L2 4" />
        </svg>
      ),
    },
    {
      label: "Continue with Google",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      ),
    },
    {
      label: "Continue with Apple",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1e1b4b">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-md flex items-center justify-center bg-purple-50 border-none cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 mb-2">
        <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-2">
          Step 1 of 3
        </p>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Connect Your Wallet
        </h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          Sign in securely with Privy. No seed phrase needed.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        {loginOptions.map((opt) => (
          <button
            key={opt.label}
            onClick={onNext}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-white/85 border border-oria backdrop-blur-[12px] shadow-card cursor-pointer text-left hover:shadow-card-hover hover:border-purple-300/30 transition-all min-h-[56px]"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              {opt.icon}
            </div>
            <span className="text-[15px] font-medium text-text-primary">
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-purple-200/40" />
        <span className="text-xs text-text-muted font-medium">or</span>
        <div className="flex-1 h-px bg-purple-200/40" />
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl border-2 border-dashed border-purple-300/50 bg-purple-50/30 text-sm font-medium text-purple-600 cursor-pointer min-h-[48px]"
      >
        Connect existing wallet
      </button>

      <div className="mt-auto pt-8">
        <ProgressDots current={1} total={STEPS} />
      </div>
    </div>
  );
}

// ─── Step 3: Choose Goal ───
function ChooseGoalStep({
  onNext,
  onBack,
}: {
  onNext: (goalType: string, targetKm: number) => void;
  onBack: () => void;
}) {
  const [goalType, setGoalType] = useState("running");
  const [targetKm, setTargetKm] = useState(10);

  const activities = [
    {
      id: "running",
      label: "Running",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="17" cy="4" r="2" />
          <path d="M15.59 13.51l2.66-2.66a1 1 0 00-1.42-1.42l-3.07 3.07a2 2 0 01-1.41.59H10.5L8 15.5" />
          <path d="M5.11 18.39A2 2 0 107.94 15.56L10.5 13H8l-4.5 4.5" />
          <path d="M17 14v6" />
        </svg>
      ),
    },
    {
      id: "cycling",
      label: "Cycling",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18.5" cy="17.5" r="3.5" />
          <circle cx="5.5" cy="17.5" r="3.5" />
          <circle cx="15" cy="5" r="1" />
          <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
        </svg>
      ),
    },
    {
      id: "steps",
      label: "Steps",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7 9.33 8.5 8 10" />
          <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 1.5.67 3 2 4.5" />
        </svg>
      ),
    },
  ];

  const quickTargets = goalType === "cycling" ? [20, 40, 60, 80] : [5, 10, 15, 20];

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-md flex items-center justify-center bg-purple-50 border-none cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 mb-2">
        <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-2">
          Step 2 of 3
        </p>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Set Your Goal
        </h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          Choose your activity and weekly target. Hit it each week to grow your
          streak and APY.
        </p>
      </div>

      {/* Activity Type */}
      <div className="mt-8 mb-6">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">
          Activity type
        </label>
        <div className="flex gap-3">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => setGoalType(a.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 cursor-pointer transition-all min-h-[80px] ${
                goalType === a.id
                  ? "border-purple-600 bg-purple-50 text-purple-600 shadow-[0_0_0_1px_#7c3aed]"
                  : "border-oria bg-white/60 text-text-secondary hover:border-purple-200"
              }`}
            >
              {a.icon}
              <span className="text-[13px] font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">
          Weekly target
        </label>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setTargetKm(Math.max(1, targetKm - 1))}
            className="w-12 h-12 rounded-xl bg-purple-50 border border-oria flex items-center justify-center text-purple-600 text-xl font-bold cursor-pointer"
          >
            -
          </button>
          <div className="flex-1 text-center">
            <span className="text-[40px] font-extrabold text-text-primary tabular-nums tracking-tight">
              {targetKm}
            </span>
            <span className="text-lg text-text-muted font-medium ml-1">
              {goalType === "steps" ? "k steps" : "km"}
            </span>
          </div>
          <button
            onClick={() => setTargetKm(targetKm + 1)}
            className="w-12 h-12 rounded-xl bg-purple-50 border border-oria flex items-center justify-center text-purple-600 text-xl font-bold cursor-pointer"
          >
            +
          </button>
        </div>
        <div className="flex gap-2">
          {quickTargets.map((t) => (
            <button
              key={t}
              onClick={() => setTargetKm(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                targetKm === t
                  ? "gradient-brand text-white shadow-button"
                  : "bg-purple-50 text-purple-600 border border-oria"
              }`}
            >
              {t} {goalType === "steps" ? "k" : "km"}
            </button>
          ))}
        </div>
      </div>

      {/* Info card */}
      <Card className="!p-4 mt-2">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Start realistic. You can always adjust your target later in
            settings.
          </p>
        </div>
      </Card>

      <div className="mt-auto pt-8 flex flex-col gap-4">
        <button
          onClick={() => onNext(goalType, targetKm)}
          className="w-full h-[52px] rounded-[14px] gradient-brand text-white font-semibold text-base shadow-button cursor-pointer border-none"
        >
          Continue
        </button>
        <ProgressDots current={2} total={STEPS} />
      </div>
    </div>
  );
}

// ─── Step 4: Fund Wallet ───
function FundWalletStep({
  onNext,
  onBack,
}: {
  onNext: (depositAmount: number, depositToken: string) => void;
  onBack: () => void;
}) {
  const [token, setToken] = useState("USDC");
  const [amount, setAmount] = useState("");

  const quickAmounts = [50, 100, 500, 1000];
  const fillPercent = Math.min(
    100,
    Math.round((parseFloat(amount || "0") / 1000) * 100),
  );

  return (
    <div className="flex flex-col min-h-screen px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-md flex items-center justify-center bg-purple-50 border-none cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 mb-2">
        <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-2">
          Step 3 of 3
        </p>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Fund Your Jar
        </h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          Deposit crypto to start earning yield. Your funds are non-custodial
          and always yours.
        </p>
      </div>

      {/* Jar illustration */}
      <div className="flex justify-center my-6">
        <MiniJar fill={fillPercent} size={80} />
      </div>

      {/* Token toggle */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">
          Token
        </label>
        <div className="flex gap-2">
          {["USDC", "AVAX"].map((t) => (
            <button
              key={t}
              onClick={() => setToken(t)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                token === t
                  ? "gradient-brand text-white shadow-button"
                  : "bg-purple-50 text-purple-600 border border-oria"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 block">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-text-muted font-medium">
            $
          </span>
          <input
            type="number"
            step="1"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-9 pr-4 py-4 rounded-xl border border-oria bg-white/80 text-[22px] font-bold text-text-primary focus:border-purple-600 outline-none tabular-nums tracking-tight"
          />
        </div>
      </div>

      {/* Quick amounts */}
      <div className="flex gap-2 mb-6">
        {quickAmounts.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(String(a))}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              amount === String(a)
                ? "gradient-brand text-white"
                : "bg-purple-50 text-purple-600 border border-oria"
            }`}
          >
            ${a}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        <button
          onClick={() => onNext(parseFloat(amount || "0"), token)}
          className="w-full h-[52px] rounded-[14px] gradient-brand text-white font-semibold text-base shadow-button cursor-pointer border-none"
        >
          Deposit & Start Earning
        </button>
        <button
          onClick={() => onNext(0, token)}
          className="w-full py-3 text-sm text-purple-400 font-medium cursor-pointer bg-transparent border-none"
        >
          Skip for now
        </button>
        <ProgressDots current={3} total={STEPS} />
      </div>
    </div>
  );
}

// ─── Main Onboarding Page ───
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [goalType, setGoalType] = useState("running");
  const [targetKm, setTargetKm] = useState(10);
  const router = useRouter();

  const finish = async (depositAmount: number, depositToken: string) => {
    // Save goal settings to mock user state
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalType, targetKm }),
    });

    // If user chose to deposit, call the deposit API
    if (depositAmount > 0) {
      await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: depositAmount, token: depositToken }),
      });
    }

    // Set onboarded cookie (expires in 30 days)
    document.cookie = "oria_onboarded=1; path=/; max-age=2592000";

    router.push("/dashboard");
  };

  return (
    <>
      {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
      {step === 1 && (
        <ConnectWalletStep onNext={() => setStep(2)} onBack={() => setStep(0)} />
      )}
      {step === 2 && (
        <ChooseGoalStep
          onNext={(gt, tk) => {
            setGoalType(gt);
            setTargetKm(tk);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <FundWalletStep onNext={finish} onBack={() => setStep(2)} />
      )}
    </>
  );
}
