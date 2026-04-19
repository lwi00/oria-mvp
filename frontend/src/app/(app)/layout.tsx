"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { InstallPrompt } from "@/components/InstallPrompt";
import { useAppAuth } from "@/lib/providers";
import SplashLoading from "@/app/loading";

const MIN_SPLASH_MS = 1800;

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated, authVerified } = useAppAuth();
  const router = useRouter();
  const wasAuthenticated = useRef(false);
  if (authenticated) wasAuthenticated.current = true;

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && !authenticated && !wasAuthenticated.current) {
      document.cookie = "oria_onboarded=; path=/; max-age=0";
      router.replace("/landing");
    }
  }, [ready, authenticated, router]);

  if (!minTimeElapsed || !ready || (!authVerified && !wasAuthenticated.current)) return <SplashLoading />;
  if (ready && !authenticated && !wasAuthenticated.current) return null;

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-oria-bg flex flex-col relative border-x border-oria animate-fadeIn">
      {/* Ambient gradient orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[420px] h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[520px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22)_0%,transparent_60%)] blur-[40px]" />
        <div className="absolute bottom-[8%] -right-[20%] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(252,76,2,0.08)_0%,transparent_70%)] blur-[40px]" />
      </div>

      <Header />

      <main className="flex-1 px-4 py-3 pb-6 relative z-[1]">
        {children}
      </main>

      <InstallPrompt />
      <TabBar />
    </div>
  );
}
